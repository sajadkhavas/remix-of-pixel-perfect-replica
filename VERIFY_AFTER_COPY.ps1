$ErrorActionPreference = "Stop"

Write-Host "=== VERIFY catalog.ts ==="
Select-String -Path ".\src\lib\catalog.ts" -Pattern 'ProductCard|CATALOG_PRODUCTS|export interface Watch' -SimpleMatch:$false

Write-Host "`n=== VERIFY PolicyPage.tsx ==="
Select-String -Path ".\src\components\content\PolicyPage.tsx" -Pattern 'export function PolicyList' -SimpleMatch

Write-Host "`n=== VERIFY brands.tsx ==="
Select-String -Path ".\src\routes\brands.tsx" -Pattern 'to="/shop"|search=\{\{ brand:' -SimpleMatch:$false

Write-Host "`n=== TYPECHECK ==="
bun run typecheck
