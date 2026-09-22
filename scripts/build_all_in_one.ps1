# PowerShell build script to generate separate Android (GZip compressed) and iOS (Universal synchronous) bundles
param()

$root = $PSScriptRoot + "\.."
$studyFile = "$root\src\data\study_guide.json"
$mockFile = "$root\src\data\mock_tests.json"
$templateFile = "$root\scripts\template_all_in_one.html"

$androidOutputFile = "$root\LifeInUK_Android_AIO.html"
$iosOutputFile = "$root\LifeInUK_iOS_AIO.html"
$universalOutputFile = "$root\LifeInUK_AIO.html"

Write-Host "======================================================="
Write-Host "  Building Dual Platform Life in the UK AIO Bundles   "
Write-Host "======================================================="

# Helper function to GZip compress byte array
function Compress-Data($bytes) {
    $ms = New-Object System.IO.MemoryStream
    $gz = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionMode]::Compress)
    $gz.Write($bytes, 0, $bytes.Length)
    $gz.Close()
    return $ms.ToArray()
}

Write-Host "1. Reading source datasets..."
$studyJson = [System.IO.File]::ReadAllText($studyFile, [System.Text.Encoding]::UTF8)
$mockJson = [System.IO.File]::ReadAllText($mockFile, [System.Text.Encoding]::UTF8)
$template = [System.IO.File]::ReadAllText($templateFile, [System.Text.Encoding]::UTF8)

# ----------------------------------------------------
# BUILD 1: Android Version (GZip Compressed, ~280 KB)
# ----------------------------------------------------
Write-Host "`n2. Compiling Android Bundle (GZip compressed for ultra-low volume)..."
$studyBytes = [System.IO.File]::ReadAllBytes($studyFile)
$studyGz = Compress-Data $studyBytes
$studyB64 = [Convert]::ToBase64String($studyGz)

$mockBytes = [System.IO.File]::ReadAllBytes($mockFile)
$mockGz = Compress-Data $mockBytes
$mockB64 = [Convert]::ToBase64String($mockGz)

$androidDatasetsCode = @"
    /* ==================== COMPRESSED OFFLINE DATASETS (ANDROID GZIP) ==================== */
    const COMPRESSED_STUDY_DATA = "$studyB64";
    const COMPRESSED_MOCK_DATA = "$mockB64";

    let rawStudyGuideData = [];
    let rawMockTestsData = [];

    async function decompressGzip(base64Str) {
      const binary = atob(base64Str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const stream = new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'));
      return await new Response(stream).json();
    }
"@

$androidStartupCode = @"
    // Start App with In-Memory Decompression (Android)
    async function startApp() {
      try {
        const [study, mock] = await Promise.all([
          decompressGzip(COMPRESSED_STUDY_DATA),
          decompressGzip(COMPRESSED_MOCK_DATA)
        ]);
        rawStudyGuideData = study;
        rawMockTestsData = mock;
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initApp);
        } else {
          initApp();
        }
      } catch (err) {
        console.error("Decompression failed:", err);
        alert("Failed to decompress offline data: " + err.message);
      }
    }

    startApp();
"@

$androidHtml = $template.Replace("/* __DATASETS_BLOCK__ */", $androidDatasetsCode).Replace("/* __STARTUP_BLOCK__ */", $androidStartupCode).Replace("<!-- __PLATFORM_TAG__ -->", "")
[System.IO.File]::WriteAllText($androidOutputFile, $androidHtml, [System.Text.Encoding]::UTF8)
$androidSize = (Get-Item $androidOutputFile).Length
Write-Host "   -> Generated: $androidOutputFile ($([Math]::Round($androidSize / 1024, 1)) KB)"

# ----------------------------------------------------
# BUILD 2: iOS Version (Synchronous JSON, 100% WebKit Safe)
# ----------------------------------------------------
Write-Host "`n3. Compiling iOS Bundle (Synchronous JSON, 100% iOS Safari & Files app safe)..."

$iosDatasetsCode = @"
    /* ==================== EMBEDDED OFFLINE DATASETS (IOS SYNCHRONOUS) ==================== */
    const rawStudyGuideData = $studyJson;
    const rawMockTestsData = $mockJson;
"@

$iosStartupCode = @"
    // Start App synchronously (iOS Safari & WebKit Safe)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initApp);
    } else {
      initApp();
    }
"@

$iosHtml = $template.Replace("/* __DATASETS_BLOCK__ */", $iosDatasetsCode).Replace("/* __STARTUP_BLOCK__ */", $iosStartupCode).Replace("<!-- __PLATFORM_TAG__ -->", " IOS")
[System.IO.File]::WriteAllText($iosOutputFile, $iosHtml, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($universalOutputFile, $iosHtml, [System.Text.Encoding]::UTF8)
$iosSize = (Get-Item $iosOutputFile).Length
Write-Host "   -> Generated: $iosOutputFile ($([Math]::Round($iosSize / 1024, 1)) KB)"
Write-Host "   -> Synced to: $universalOutputFile ($([Math]::Round($iosSize / 1024, 1)) KB)"

Write-Host "`n-------------------------------------------------------"
Write-Host "Build Complete!"
Write-Host "Android Target: LifeInUK_Android_AIO.html  ($([Math]::Round($androidSize / 1024, 1)) KB - GZip compressed)"
Write-Host "iOS Target:     LifeInUK_iOS_AIO.html      ($([Math]::Round($iosSize / 1024, 1)) KB - Zero WebKit errors)"
Write-Host "-------------------------------------------------------"
