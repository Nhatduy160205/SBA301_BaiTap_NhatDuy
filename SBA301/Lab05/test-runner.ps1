param(
    [string]$baseUrl = "http://localhost:8080/orchids",
    [string]$origin = "http://localhost:5173"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SBA301 LAB 05 AUTOMATED INTEGRATION TEST SUITE (T01 - T10)" -ForegroundColor Cyan
Write-Host " Backend Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host " Frontend Origin:  $origin" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$report = @()

function Record-Test($id, $name, $expected, $actual, $detail) {
    $pass = ($expected -eq $actual)
    $obj = [PSCustomObject]@{
        TestId   = $id
        TestName = $name
        Expected = $expected
        Actual   = $actual
        Result   = if ($pass) { "PASS" } else { "FAIL" }
        Detail   = $detail
    }
    $script:report += $obj
    $color = if ($pass) { "Green" } else { "Red" }
    Write-Host "[$($obj.Result)] $id - ${name}: Actual=$actual, Expected=$expected ($detail)" -ForegroundColor $color
}

# T01: GET /orchids/ List
try {
    $r01 = Invoke-RestMethod -Uri "$baseUrl/" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T01" "GET /orchids/ List" 200 200 "Count: $($r01.Count) records"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T01" "GET /orchids/ List" 200 $code $_.Exception.Message
}

# T02: POST /orchids/ Create Valid Orchid (Step 5.1 Seed Data)
$createdId = $null
$body02 = @{
    orchidName = "Taichung Beauty Lab05"
    natural = $true
    orchidDescription = "Demo orchid for SBA301 Lab 05"
    orchidCategory = "Cattleya"
    attractive = $true
    orchidURL = "https://example.com/orchid.jpg"
} | ConvertTo-Json

try {
    $res02 = Invoke-RestMethod -Uri "$baseUrl/" -Method POST -Body $body02 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    $createdId = $res02.orchidId
    Record-Test "T02" "POST /orchids/ Create" 201 201 "Created ID: $createdId, Name: $($res02.orchidName)"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T02" "POST /orchids/ Create" 201 $code $_.Exception.Message
}

# T03: GET /orchids/{id}
try {
    $res03 = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T03" "GET /orchids/{id}" 200 200 "Name: $($res03.orchidName), Category: $($res03.orchidCategory)"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T03" "GET /orchids/{id}" 200 $code $_.Exception.Message
}

# T04: PUT /orchids/{id} Update Orchid
$body04 = @{
    orchidName = "Taichung Beauty Lab05 Updated"
    natural = $false
    orchidDescription = "Updated description in Lab 05"
    orchidCategory = "Dendrobium"
    attractive = $true
    orchidURL = "https://example.com/updated.jpg"
} | ConvertTo-Json

try {
    $res04 = Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method PUT -Body $body04 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    Record-Test "T04" "PUT /orchids/{id} Update" 200 200 "Updated name: $($res04.orchidName)"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T04" "PUT /orchids/{id} Update" 200 $code $_.Exception.Message
}

# T05: PUT /orchids/99999999 Invalid ID -> 404
try {
    Invoke-RestMethod -Uri "$baseUrl/99999999" -Method PUT -Body $body04 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    Record-Test "T05" "PUT Invalid ID" 404 200 "Expected 404"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T05" "PUT Invalid ID" 404 $code "404 Not Found"
}

# T06: POST Reject Blank Name -> 400
$body06 = @{
    orchidName = "   "
    natural = $true
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/" -Method POST -Body $body06 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    Record-Test "T06" "POST Reject Blank Name" 400 200 "Expected 400"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T06" "POST Reject Blank Name" 400 $code "400 Bad Request"
}

# T07: CORS Preflight OPTIONS Check
try {
    $res07 = Invoke-WebRequest -Uri "$baseUrl/" -Method OPTIONS -Headers @{
        "Origin" = $origin
        "Access-Control-Request-Method" = "PUT"
    }
    $corsOrigin = $res07.Headers["Access-Control-Allow-Origin"]
    Record-Test "T07" "CORS Preflight OPTIONS" 200 $res07.StatusCode "Allow-Origin: $corsOrigin"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T07" "CORS Preflight OPTIONS" 200 $code $_.Exception.Message
}

# T08: DELETE /orchids/{id} -> 204
try {
    $res08 = Invoke-WebRequest -Uri "$baseUrl/$createdId" -Method DELETE -Headers @{ "Origin" = $origin }
    Record-Test "T08" "DELETE /orchids/{id}" 204 $res08.StatusCode "204 No Content"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T08" "DELETE /orchids/{id}" 204 $code $_.Exception.Message
}

# T09: GET Deleted ID -> 404
try {
    Invoke-RestMethod -Uri "$baseUrl/$createdId" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T09" "GET Deleted ID" 404 200 "Expected 404"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T09" "GET Deleted ID" 404 $code "404 Not Found"
}

# T10: DELETE Missing ID -> 404
try {
    Invoke-WebRequest -Uri "$baseUrl/99999999" -Method DELETE -Headers @{ "Origin" = $origin }
    Record-Test "T10" "DELETE Missing ID" 404 200 "Expected 404"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { $null }
    Record-Test "T10" "DELETE Missing ID" 404 $code "404 Not Found"
}

Write-Host "`n=================== BANG TONG KET KET QUA TEST MATRIX ===================" -ForegroundColor Yellow
$report | Format-Table -AutoSize
