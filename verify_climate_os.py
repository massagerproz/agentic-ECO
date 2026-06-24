from playwright.sync_api import sync_playwright
import time

def run_cuj(page):
    # Wait for the frontend server to spin up
    for _ in range(10):
        try:
            page.goto("http://localhost:5173", timeout=5000)
            break
        except Exception:
            time.sleep(2)

    page.wait_for_timeout(2000)

    # 1. Extraction UI
    print("Extracting evidence...")
    # Wait for the textbox to be available, since Vite might still be loading chunked assets
    page.wait_for_selector("textarea")
    page.get_by_role("textbox").fill("The team decided to proceed with the wind farm expansion project in Q3. Potential risk: Supply chain delays for turbines. Follow-up action: Alice to contact suppliers next week.")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Extract Evidence").click()

    # Wait for AI processing
    page.wait_for_timeout(4000)

    # Save the extracted drafts
    print("Saving drafts...")
    # Need to wait for the button to appear first before selecting it
    page.wait_for_selector("button:has-text('Save as Draft')", timeout=10000)
    save_buttons = page.locator("button:has-text('Save as Draft')").all()
    print(f"Found {len(save_buttons)} save buttons")
    for btn in save_buttons:
        btn.click()
        page.wait_for_timeout(1000) # Ensure saving finishes

    # 2. Approval UI
    print("Approving evidence...")
    # Give convex a second to sync
    page.wait_for_timeout(2000)
    approve_buttons = page.locator("button:has-text('Approve')").all()

    # Check what buttons we have
    print(f"Found {len(approve_buttons)} approve buttons")

    # Let's approve the first two
    for i in range(min(2, len(approve_buttons))):
        page.locator("button:has-text('Approve')").nth(0).click() # It's nth 0 because the first one disappears
        page.wait_for_timeout(1000)

    # 3. Evidence Tracker UI
    print("Viewing Evidence Tracker...")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
    page.wait_for_timeout(2500)

    # 4. Report Generation UI
    print("Generating report...")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000)

    # Check if Generate Donor Report button is enabled
    generate_btn = page.get_by_role("button", name="Generate Donor Report")

    # We might need to wait for Convex query to sync to get approved drafts length
    page.wait_for_timeout(3000)

    try:
        generate_btn.click(timeout=5000)
        page.wait_for_timeout(4000) # Wait for generation

        page.get_by_role("button", name="Run QA Review").click()
        page.wait_for_timeout(3000) # Wait for QA
    except Exception as e:
        print(f"Could not generate report: {e}")

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/verification.png", full_page=True)
    page.wait_for_timeout(1000)  # Hold final state for the video

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={'width': 1280, 'height': 800}
        )
        page = context.new_page()
        # Accept dialogs
        page.on("dialog", lambda dialog: dialog.accept())
        try:
            run_cuj(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
