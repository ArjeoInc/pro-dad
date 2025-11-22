from playwright.sync_api import sync_playwright, expect
import time

def verify_hammer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:5173")
        except:
            print("Retrying connection...")
            time.sleep(5)
            page.goto("http://localhost:5173")

        # Wait for the game area to load
        # The smash button is the second button (index 1) or we can find it by class
        # The button has class "w-full h-full relative group"

        smash_button = page.locator(".w-full.h-full.relative.group")

        # Trigger smash
        smash_button.click()

        # Wait a tiny bit for animation to start/be visible.
        # The animation is 300ms total.
        # We want to catch it in the middle.
        time.sleep(0.1)

        # Take screenshot
        page.screenshot(path="verification/hammer_smash.png")

        browser.close()

if __name__ == "__main__":
    verify_hammer()
