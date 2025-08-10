# PowerShell script to test Heartly API endpoints

Write-Host "🧪 Testing Heartly Backend API" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8002/health" -Method GET
    Write-Host "✅ Health Check: $($response.status)" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Auth Nonce (with wallet address)
Write-Host "`n2. Testing Auth Nonce Endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        walletAddress = "0x1234567890123456789012345678901234567890"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8002/auth/request-nonce" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Auth Nonce: Success" -ForegroundColor Green
    Write-Host "   Nonce received" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Auth Nonce Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Socket.IO endpoint
Write-Host "`n3. Testing Socket.IO Endpoint..." -ForegroundColor Yellow
try {
    # Test the configured socket path
    $response = Invoke-WebRequest -Uri "http://localhost:8002/socket/?EIO=4&transport=polling" -Method GET
    Write-Host "✅ Socket.IO: Accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    try {
        # Fallback to default socket.io path
        $response = Invoke-WebRequest -Uri "http://localhost:8002/socket.io/?EIO=4&transport=polling" -Method GET
        Write-Host "✅ Socket.IO: Accessible on default path (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Socket.IO Failed on both paths: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: CORS Headers
Write-Host "`n4. Testing CORS Headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8002/health" -Method GET
    $corsHeader = $response.Headers['Access-Control-Allow-Credentials']
    if ($corsHeader -eq 'true') {
        Write-Host "✅ CORS: Properly configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CORS: May need configuration" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Check if server is listening on expected ports
Write-Host "`n5. Checking Server Ports..." -ForegroundColor Yellow
$port8002 = netstat -an | Select-String ":8002.*LISTENING"
$port8003 = netstat -an | Select-String ":8003.*LISTENING"

if ($port8002) {
    Write-Host "✅ Port 8002: Server listening" -ForegroundColor Green
} else {
    Write-Host "❌ Port 8002: Not listening" -ForegroundColor Red
}

if ($port8003) {
    Write-Host "✅ Port 8003: Socket server listening" -ForegroundColor Green
} else {
    Write-Host "⚠️ Port 8003: Socket server may be integrated with main server" -ForegroundColor Yellow
}

Write-Host "`n🎯 API Testing Complete!" -ForegroundColor Green
Write-Host "Backend is running on: http://localhost:8002" -ForegroundColor Cyan
Write-Host "Socket.IO path: http://localhost:8002/socket.io/" -ForegroundColor Cyan