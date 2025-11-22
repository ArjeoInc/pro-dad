from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_toe_smash_game(page: Page):
    # 1. Arrange: Go to the local dev server.
    page.goto("http://localhost:5173")

    # Wait for the canvas to load (this is tricky with WebGL, so we wait for a UI element)
    # The canvas itself might not be easily queryable for content, but we can check if the container exists
    expect(page.locator("canvas")).to_be_visible(timeout=10000)

    # 2. Act: Smash the toe!
    # Find the button that wraps the canvas/toe area
    smash_area = page.get_by_label("Smash Toe")
    smash_area.click()

    # Wait a moment for animation
    time.sleep(0.5)

    # 3. Assert: Check if score increased
    # The score starts at 0 and should increase after smash
    # We can check if the score text is not "0" anymore or just take a screenshot

    # 4. Screenshot: Capture the smashed state with blood particles
    page.screenshot(path="/home/jules/verification/toe_smash_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_toe_smash_game(page)
        finally:
            browser.close()
