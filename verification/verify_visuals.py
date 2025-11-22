from playwright.sync_api import sync_playwright, expect
import time

def verify_game_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local dev server
        # Assuming standard Vite port 5173, but I should check the logs if it fails.
        page.goto("http://localhost:5173")

        # Wait for the canvas to be present
        page.wait_for_selector("canvas")

        # Give it some time to load the 3D scene
        time.sleep(3)

        # Take a screenshot of the Idle state (The Toe)
        page.screenshot(path="verification/toe_idle.png")
        print("Captured idle state.")

        # Trigger a smash
        # The button covers the whole area: aria-label="Smash Toe"
        smash_button = page.get_by_label("Smash Toe")
        smash_button.click()

        # Wait a brief moment for the hammer to appear and smash
        # The animation is fast (300ms reset), so we need to catch it.
        # The hammer appears immediately.
        time.sleep(0.1)

        # Take a screenshot of the Smash state (Hammer + Squashed Toe)
        page.screenshot(path="verification/toe_smash.png")
        print("Captured smash state.")

        browser.close()

if __name__ == "__main__":
    verify_game_visuals()
