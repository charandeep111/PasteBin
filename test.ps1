#!/usr/bin/env pwsh
# Pastebin-Lite Test Script
# Tests all critical functionality against the specification

Write-Host "=== Pastebin-Lite Automated Tests ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testTime = 1706457600000  # Fixed timestamp for deterministic testing
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method = "GET",
        [string]$Uri,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [string]$ExpectedContent = $null
    )
    
    Write-Host "Testing: $Name" -NoNewline
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
            ErrorAction = 'Stop'
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            if ($ExpectedContent -and $response.Content -notlike "*$ExpectedContent*") {
                Write-Host " [FAIL] - Wrong content" -ForegroundColor Red
                $script:failed++
                return $false
            }
            Write-Host " [PASS]" -ForegroundColor Green
            $script:passed++
            return $response
        } else {
            Write-Host " [FAIL] - Status $($response.StatusCode) (expected $ExpectedStatus)" -ForegroundColor Red
            $script:failed++
            return $false
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq $ExpectedStatus) {
            Write-Host " [PASS]" -ForegroundColor Green
            $script:passed++
            return $true
        } else {
            Write-Host " [FAIL] - $($_.Exception.Message)" -ForegroundColor Red
            $script:failed++
            return $false
        }
    }
}

# Test 1: Health Check
Write-Host "`n--- Health Check Tests ---" -ForegroundColor Yellow
Test-Endpoint -Name "Health check returns 200" `
    -Uri "$baseUrl/api/healthz" `
    -ExpectedStatus 200 `
    -ExpectedContent '"ok":true'

# Test 2: Create Paste
Write-Host "`n--- Create Paste Tests ---" -ForegroundColor Yellow

$createBody = @{
    content = "Test content for automated testing"
    ttl_seconds = 120
    max_views = 3
} | ConvertTo-Json

$createHeaders = @{
    'Content-Type' = 'application/json'
    'x-test-now-ms' = $testTime.ToString()
}

$createResponse = Test-Endpoint -Name "Create paste with TTL and max_views" `
    -Method POST `
    -Uri "$baseUrl/api/pastes" `
    -Headers $createHeaders `
    -Body $createBody `
    -ExpectedStatus 201 `
    -ExpectedContent '"id"'

if ($createResponse) {
    $pasteData = $createResponse.Content | ConvertFrom-Json
    $pasteId = $pasteData.id
    Write-Host "  Created paste ID: $pasteId" -ForegroundColor Gray
    
    # Test 3: Fetch Paste
    Write-Host "`n--- Fetch Paste Tests ---" -ForegroundColor Yellow
    
    $fetchHeaders = @{
        'x-test-now-ms' = $testTime.ToString()
    }
    
    $fetchResponse = Test-Endpoint -Name "Fetch paste (view 1/3)" `
        -Uri "$baseUrl/api/pastes/$pasteId" `
        -Headers $fetchHeaders `
        -ExpectedStatus 200 `
        -ExpectedContent '"remaining_views":2'
    
    Test-Endpoint -Name "Fetch paste (view 2/3)" `
        -Uri "$baseUrl/api/pastes/$pasteId" `
        -Headers $fetchHeaders `
        -ExpectedStatus 200 `
        -ExpectedContent '"remaining_views":1'
    
    Test-Endpoint -Name "Fetch paste (view 3/3)" `
        -Uri "$baseUrl/api/pastes/$pasteId" `
        -Headers $fetchHeaders `
        -ExpectedStatus 200 `
        -ExpectedContent '"remaining_views":0'
    
    Test-Endpoint -Name "Fetch paste (view 4/3 - should 404)" `
        -Uri "$baseUrl/api/pastes/$pasteId" `
        -Headers $fetchHeaders `
        -ExpectedStatus 404
    
    # Test 4: TTL Expiry
    Write-Host "`n--- TTL Expiry Tests ---" -ForegroundColor Yellow
    
    $createBody2 = @{
        content = "TTL test paste"
        ttl_seconds = 60
    } | ConvertTo-Json
    
    $createResponse2 = Test-Endpoint -Name "Create paste with TTL only" `
        -Method POST `
        -Uri "$baseUrl/api/pastes" `
        -Headers $createHeaders `
        -Body $createBody2 `
        -ExpectedStatus 201
    
    if ($createResponse2) {
        $pasteData2 = $createResponse2.Content | ConvertFrom-Json
        $pasteId2 = $pasteData2.id
        
        $beforeExpiryHeaders = @{
            'x-test-now-ms' = ($testTime + 30000).ToString()  # 30 seconds later
        }
        
        Test-Endpoint -Name "Fetch before expiry (30s)" `
            -Uri "$baseUrl/api/pastes/$pasteId2" `
            -Headers $beforeExpiryHeaders `
            -ExpectedStatus 200
        
        $afterExpiryHeaders = @{
            'x-test-now-ms' = ($testTime + 70000).ToString()  # 70 seconds later
        }
        
        Test-Endpoint -Name "Fetch after expiry (70s) - should 404" `
            -Uri "$baseUrl/api/pastes/$pasteId2" `
            -Headers $afterExpiryHeaders `
            -ExpectedStatus 404
    }
    
    # Test 5: Validation
    Write-Host "`n--- Validation Tests ---" -ForegroundColor Yellow
    
    $invalidBody1 = @{
        content = ""
    } | ConvertTo-Json
    
    Test-Endpoint -Name "Empty content should fail" `
        -Method POST `
        -Uri "$baseUrl/api/pastes" `
        -Headers $createHeaders `
        -Body $invalidBody1 `
        -ExpectedStatus 400
    
    $invalidBody2 = @{
        content = "Valid content"
        ttl_seconds = 0
    } | ConvertTo-Json
    
    Test-Endpoint -Name "TTL < 1 should fail" `
        -Method POST `
        -Uri "$baseUrl/api/pastes" `
        -Headers $createHeaders `
        -Body $invalidBody2 `
        -ExpectedStatus 400
    
    $invalidBody3 = @{
        content = "Valid content"
        max_views = -1
    } | ConvertTo-Json
    
    Test-Endpoint -Name "max_views < 1 should fail" `
        -Method POST `
        -Uri "$baseUrl/api/pastes" `
        -Headers $createHeaders `
        -Body $invalidBody3 `
        -ExpectedStatus 400
}

# Test 6: Non-existent Paste
Write-Host "`n--- 404 Tests ---" -ForegroundColor Yellow
Test-Endpoint -Name "Non-existent paste should 404" `
    -Uri "$baseUrl/api/pastes/nonexistent123" `
    -ExpectedStatus 404

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`nAll tests passed! ✅" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSome tests failed! ❌" -ForegroundColor Red
    exit 1
}
