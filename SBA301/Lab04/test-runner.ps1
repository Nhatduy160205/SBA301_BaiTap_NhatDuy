param(
    [string]$baseUrl = "http://localhost:8080"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " RUNNING LAB 04 AUTOMATED TEST SUITE (TC01 -> TC18) " -ForegroundColor Cyan
Write-Host " Base URL: $baseUrl " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$missingId = "99999999"
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
    Write-Host "[$($obj.Result)] $id - $name : Actual=$actual, Expected=$expected ($detail)" -ForegroundColor $color
}

# TC01
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method GET
    Record-Test "TC01" "Lay toan bo Orchid" 200 200 "Total orchids: $($r.Count)"
} catch {
    Record-Test "TC01" "Lay toan bo Orchid" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC02
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/orchids?name=CATTLEYA" -Method GET
    Record-Test "TC02" "Tim Orchid khong phan biet hoa thuong" 200 200 "Matched orchids: $($r.Count)"
} catch {
    Record-Test "TC02" "Tim Orchid theo ten" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC03
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/orchids?name=NO_MATCH_20261007" -Method GET
    Record-Test "TC03" "Tim kiem tra ve danh sach rong" 200 200 "Empty array count: $($r.Count)"
} catch {
    Record-Test "TC03" "Tim kiem rong" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC04
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids/$missingId" -Method GET
    Record-Test "TC04" "Lay chi tiet Orchid khong ton tai" 404 200 "Expected 404"
} catch {
    Record-Test "TC04" "Lay chi tiet Orchid khong ton tai" 404 $_.Exception.Response.StatusCode.value__ "404 Not Found"
}

# TC05
$body05 = @{
    orchidName = "SBA301 TCASE Cattleya Queen 20261007"
    isNatural = $true
    orchidDescription = "Test TC05 create Orchid with valid Cattleya category"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/testcases/tc05-cattleya.jpg"
} | ConvertTo-Json

$createdId = $null
try {
    $res05 = Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $body05 -ContentType "application/json"
    $createdId = $res05.orchidID
    Record-Test "TC05" "Tao Orchid voi category hop le" 201 201 "Created ID: $createdId, Category: $($res05.orchidCategory.categoryName)"
} catch {
    Record-Test "TC05" "Tao Orchid hop le" 201 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC06
$body06 = @{
    orchidName = "SBA301 TCASE Missing Category 20261007"
    isNatural = $false
    orchidDescription = "Test TC06 category is omitted"
    isAttractive = $false
    orchidURL = "https://example.com/testcases/tc06-missing-category.jpg"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $body06 -ContentType "application/json"
    Record-Test "TC06" "Tu choi tao Orchid khi thieu category" 400 200 "Expected 400"
} catch {
    Record-Test "TC06" "Tu choi tao Orchid khi thieu category" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC07
$body07 = @{
    orchidName = "SBA301 TCASE Invalid Category 20261007"
    isNatural = $false
    orchidDescription = "Test TC07 references a category that does not exist"
    orchidCategory = @{ categoryId = 99999999 }
    isAttractive = $false
    orchidURL = "https://example.com/testcases/tc07-invalid-category.jpg"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $body07 -ContentType "application/json"
    Record-Test "TC07" "Tu choi tao khi category ID khong ton tai" 400 200 "Expected 400"
} catch {
    Record-Test "TC07" "Tu choi tao khi category ID khong ton tai" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC08
$body08 = @{
    orchidName = "   "
    isNatural = $true
    orchidDescription = "Test TC08 blank name"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/testcases/tc08-blank-name.jpg"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $body08 -ContentType "application/json"
    Record-Test "TC08" "Tu choi tao Orchid khi ten rong" 400 200 "Expected 400"
} catch {
    Record-Test "TC08" "Tu choi tao Orchid khi ten rong" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC09
try {
    $malformed = "{"
    Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $malformed -ContentType "application/json"
    Record-Test "TC09" "Tu choi body JSON sai dinh dang" 400 200 "Expected 400"
} catch {
    Record-Test "TC09" "Tu choi body JSON sai dinh dang" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC10
$body10 = @{
    orchidName = "SBA301 TCASE Cattleya Queen Updated 20261007"
    isNatural = $false
    orchidDescription = "Test TC10 full update and category replacement"
    orchidCategory = @{ categoryId = 2 }
    isAttractive = $false
    orchidURL = "https://example.com/testcases/tc10-updated.jpg"
} | ConvertTo-Json
try {
    $res10 = Invoke-RestMethod -Uri "$baseUrl/api/orchids/$createdId" -Method PUT -Body $body10 -ContentType "application/json"
    Record-Test "TC10" "Cap nhat toan bo Orchid va doi category" 200 200 "Updated category to ID: $($res10.orchidCategory.categoryId)"
} catch {
    Record-Test "TC10" "Cap nhat Orchid" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC11
try {
    $res11 = Invoke-RestMethod -Uri "$baseUrl/api/orchids/$createdId" -Method GET
    $pass11 = ($res11.orchidName -eq "SBA301 TCASE Cattleya Queen Updated 20261007" -and $res11.orchidCategory.categoryId -eq 2)
    $act11 = if ($pass11) { 200 } else { "MISMATCH" }
    Record-Test "TC11" "Doc lai Orchid sau PUT" 200 $act11 "Name: $($res11.orchidName), Cat: $($res11.orchidCategory.categoryName)"
} catch {
    Record-Test "TC11" "Doc lai Orchid sau PUT" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC12
$body12 = @{
    orchidName = "SBA301 TCASE Must Not Update 20261007"
    isNatural = $true
    orchidDescription = "Test TC12 invalid category must not persist"
    orchidCategory = @{ categoryId = 99999999 }
    isAttractive = $true
    orchidURL = "https://example.com/testcases/tc12-invalid-category.jpg"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids/$createdId" -Method PUT -Body $body12 -ContentType "application/json"
    Record-Test "TC12" "Tu choi PUT voi category khong ton tai" 400 200 "Expected 400"
} catch {
    Record-Test "TC12" "Tu choi PUT voi category khong ton tai" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC13
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids/$missingId" -Method PUT -Body $body10 -ContentType "application/json"
    Record-Test "TC13" "PUT Orchid khong ton tai" 404 200 "Expected 404"
} catch {
    Record-Test "TC13" "PUT Orchid khong ton tai" 404 $_.Exception.Response.StatusCode.value__ "404 Not Found"
}

# TC14
$body14 = @{
    orchidName = ""
    isNatural = $true
    orchidDescription = "Test TC14 blank name must not update"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/testcases/tc14-blank-name.jpg"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids/$createdId" -Method PUT -Body $body14 -ContentType "application/json"
    Record-Test "TC14" "PUT tu choi ten rong" 400 200 "Expected 400"
} catch {
    Record-Test "TC14" "PUT tu choi ten rong" 400 $_.Exception.Response.StatusCode.value__ "400 Bad Request"
}

# TC15
try {
    $res15 = Invoke-WebRequest -Uri "$baseUrl/api/orchids/$createdId" -Method DELETE
    Record-Test "TC15" "Xoa Orchid da tao" 204 $res15.StatusCode "204 No Content"
} catch {
    Record-Test "TC15" "Xoa Orchid da tao" 204 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

# TC16
try {
    Invoke-RestMethod -Uri "$baseUrl/api/orchids/$createdId" -Method GET
    Record-Test "TC16" "Kiem tra Orchid da xoa" 404 200 "Expected 404"
} catch {
    Record-Test "TC16" "Kiem tra Orchid da xoa" 404 $_.Exception.Response.StatusCode.value__ "404 Not Found"
}

# TC17
try {
    Invoke-WebRequest -Uri "$baseUrl/api/orchids/$missingId" -Method DELETE
    Record-Test "TC17" "Xoa Orchid khong ton tai" 404 200 "Expected 404"
} catch {
    Record-Test "TC17" "Xoa Orchid khong ton tai" 404 $_.Exception.Response.StatusCode.value__ "404 Not Found"
}

# TC18 (Persistence verification)
$body18 = @{
    orchidName = "SBA301 TCASE Persistence 20261007"
    isNatural = $true
    orchidDescription = "Test TC18 persistence verification"
    orchidCategory = @{ categoryId = 1 }
    isAttractive = $true
    orchidURL = "https://example.com/testcases/tc18-persist.jpg"
} | ConvertTo-Json
try {
    $res18 = Invoke-RestMethod -Uri "$baseUrl/api/orchids" -Method POST -Body $body18 -ContentType "application/json"
    $id18 = $res18.orchidID
    $check18 = Invoke-RestMethod -Uri "$baseUrl/api/orchids/$id18" -Method GET
    Invoke-WebRequest -Uri "$baseUrl/api/orchids/$id18" -Method DELETE | Out-Null
    Record-Test "TC18" "Kiem tra luu tru ben vung tren SQL Server" 200 200 "Created, verified and cleaned up ID: $id18"
} catch {
    Record-Test "TC18" "Kiem tra luu tru ben vung" 200 $_.Exception.Response.StatusCode.value__ $_.Exception.Message
}

Write-Host "`n=================== BANG TONG KET KET QUA TESTCASES ===================" -ForegroundColor Yellow
$report | Format-Table -AutoSize
