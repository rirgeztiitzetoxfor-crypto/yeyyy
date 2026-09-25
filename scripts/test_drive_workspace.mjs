import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/kartikey/.gemini/antigravity/brain/4c99da6b-e190-439b-a90b-b5a3ca2f4da3";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:8080/admin ...");
  await page.goto("http://localhost:8080/admin", { waitUntil: "networkidle" });

  // Check if login needed
  const passwordInput = await page.$("input[type='password']");
  if (passwordInput) {
    console.log("Logging in with passcode...");
    await passwordInput.fill("ATMOSPHERE_2026");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1000);
  }

  console.log("Locating Google Drive Workspace tab in navbar...");
  const workspaceTabBtn = page.locator("button:has-text('Google Drive Workspace')");
  await workspaceTabBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of Google Drive Workspace tab
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "proof_google_drive_workspace_tab.png"),
    fullPage: false,
  });
  console.log("Saved proof_google_drive_workspace_tab.png");

  // Click on lg_corporate folder
  console.log("Clicking lg_corporate folder...");
  const lgFolder = page.locator("h4:has-text('lg_corporate')");
  await lgFolder.click();
  await page.waitForTimeout(800);

  // Take screenshot of drilled-down folder
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "proof_google_drive_folder_drilldown.png"),
    fullPage: false,
  });
  console.log("Saved proof_google_drive_folder_drilldown.png");

  // Switch to Media Uploader tab
  console.log("Switching to Media Uploader tab...");
  const uploaderTabBtn = page.locator("button:has-text('Media Uploader')");
  await uploaderTabBtn.click();
  await page.waitForTimeout(600);

  // Switch to Google Drive source mode
  console.log("Selecting Google Drive mode inside uploader...");
  const gdriveModeBtn = page.locator("button:has-text('Google Drive / Link')");
  await gdriveModeBtn.click();
  await page.waitForTimeout(800);

  // Scroll down to Step 2 so embedded workspace is visible
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);

  // Take screenshot of embedded workspace inside uploader
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "proof_uploader_gdrive_workspace_embedded.png"),
    fullPage: false,
  });
  console.log("Saved proof_uploader_gdrive_workspace_embedded.png");

  await browser.close();
  console.log("Playwright verification completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
