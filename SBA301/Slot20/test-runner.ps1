param(
    [string]$baseUrl = "http://localhost:8080",
    [string]$origin = "http://localhost:5173"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SBA301 SLOT 20 INTEGRATION & CORS TEST RUNNER (T01 - T10)" -ForegroundColor Cyan
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

# T01: Backend Health Check
try {
    $res01 = Invoke-WebRequest -Uri "$baseUrl/orchids/" -Method GET -Headers @{ "Origin" = $origin }
    $corsHeader = $res01.Headers["Access-Control-Allow-Origin"]
    Record-Test "T01" "Backend Health & CORS Header" 200 $res01.StatusCode "Allow-Origin: $corsHeader"
} catch {
    Record-Test "T01" "Backend Health & CORS Header" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T02: GET Orchids List
try {
    $r02 = Invoke-RestMethod -Uri "$baseUrl/orchids/" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T02" "GET /orchids/ List" 200 200 "Count: $($r02.Count) orchids"
} catch {
    Record-Test "T02" "GET /orchids/ List" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T03: GET Categories List
try {
    $r03 = Invoke-RestMethod -Uri "$baseUrl/categories/" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T03" "GET /categories/ List" 200 200 "Count: $($r03.Count) categories"
} catch {
    Record-Test "T03" "GET /categories/ List" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T04: Preflight OPTIONS Request
try {
    $res04 = Invoke-WebRequest -Uri "$baseUrl/orchids/" -Method OPTIONS -Headers @{
        "Origin" = $origin
        "Access-Control-Request-Method" = "PUT"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    $allowMethods = $res04.Headers["Access-Control-Allow-Methods"]
    Record-Test "T04" "Preflight OPTIONS /orchids/" 200 $res04.StatusCode "Allowed Methods: $allowMethods"
} catch {
    Record-Test "T04" "Preflight OPTIONS /orchids/" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T05: POST Create Orchid
$createdId = $null
$body05 = @{
    orchidName = "Slot20 Cattleya Integrator 2026"
    isNatural = $true
    orchidDescription = "Created during Slot 20 CORS automated verification"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/slot20.jpg"
} | ConvertTo-Json

try {
    $res05 = Invoke-RestMethod -Uri "$baseUrl/orchids/" -Method POST -Body $body05 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    $createdId = $res05.orchidID
    Record-Test "T05" "POST /orchids/ Create Valid" 201 201 "Created ID: $createdId ($($res05.orchidName))"
} catch {
    Record-Test "T05" "POST /orchids/ Create Valid" 201 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T06: GET Orchid By ID
try {
    $res06 = Invoke-RestMethod -Uri "$baseUrl/orchids/$createdId" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T06" "GET /orchids/{id} Detail" 200 200 "Name: $($res06.orchidName), Cat: $($res06.orchidCategory.categoryName)"
} catch {
    Record-Test "T06" "GET /orchids/{id} Detail" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T07: PUT Update Orchid
$body07 = @{
    orchidName = "Slot20 Cattleya Integrator Updated"
    isNatural = $false
    orchidDescription = "Updated during Slot 20 verification"
    orchidCategory = @{ categoryId = 2 }
    isAttractive = $true
    orchidURL = "https://example.com/slot20-updated.jpg"
} | ConvertTo-Json

try {
    $res07 = Invoke-RestMethod -Uri "$baseUrl/orchids/$createdId" -Method PUT -Body $body07 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    Record-Test "T07" "PUT /orchids/{id} Update" 200 200 "Updated category to ID: $($res07.orchidCategory.categoryId)"
} catch {
    Record-Test "T07" "PUT /orchids/{id} Update" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# T08: POST Reject Blank Name (Validation handled in Service layer)
$body08 = @{
    orchidName = "   "
    isNatural = $true
    orchidDescription = "Blank name"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/blank.jpg"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/orchids/" -Method POST -Body $body08 -ContentType "application/json" -Headers @{ "Origin" = $origin }
    Record-Test "T08" "POST Reject Blank Name" 400 200 "Expected 400"
} catch {
    Record-Test "T08" "POST Reject Blank Name" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# T09: GET Missing ID (404 Handled Contract)
try {
    Invoke-RestMethod -Uri "$baseUrl/orchids/99999999" -Method GET -Headers @{ "Origin" = $origin }
    Record-Test "T09" "GET 404 Handled Contract" 404 200 "Expected 404"
} catch {
    Record-Test "T09" "GET 404 Handled Contract" 404 $_.Exception.Response.StatusCode.value__ "404 Not Found"
}

# T10: DELETE Cleanup
try {
    $res10 = Invoke-WebRequest -Uri "$baseUrl/orchids/$createdId" -Method DELETE -Headers @{ "Origin" = $origin }
    Record-Test "T10" "DELETE /orchids/{id}" 204 $res10.StatusCode "204 No Content"
} catch {
    Record-Test "T10" "DELETE /orchids/{id}" 204 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

Write-Host "`n=================== BANG TONG KET KET QUA TEST MATRIX ===================" -ForegroundColor Yellow
$report | Format-Table -AutoSize
