import { test, expect, type Page } from "@playwright/test";
import { ROUTES } from "@/constants/routes";

const pages = [
  {
    name: "home",
    path: ROUTES.INDEX,
    find: (p: Page) => p.getByText(/passionate about building products/),
  },
  {
    name: "projects",
    path: ROUTES.PROJECTS,
    find: (p: Page) => p.getByText("GIFHunter").first(),
  },
  {
    name: "contact",
    path: ROUTES.CONTACT,
    find: (p: Page) => p.getByRole("button", { name: "Submit" }),
  },
  {
    name: "GIFHunter",
    path: ROUTES.GIFHUNTER_INDEX,
    find: (p: Page) => p.getByRole("link", { name: "GIFHunter" }),
  },
  {
    name: "Spotify login",
    path: ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN,
    find: (p: Page) => p.getByRole("button", { name: "Log In With Spotify" }),
  },
];

for (const { name, path, find } of pages) {
  test(`${name} page loads without errors`, async ({ page }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => errors.push(error));

    const response = await page.goto(path);

    expect(response?.ok()).toBe(true);
    await expect(find(page)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("navigation reaches the contact page", async ({ page }) => {
  await page.goto(ROUTES.PROJECTS);

  // Phones use the hamburger menu, so open it if it's showing
  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) await menu.click();

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(ROUTES.CONTACT);
});

test("empty contact form shows validation errors", async ({ page }) => {
  await page.goto(ROUTES.CONTACT);
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Forename must not be empty")).toBeVisible();
  await expect(page.getByText(/some details are incorrect/i)).toBeVisible();
});

test("collage redirects to login when logged out", async ({ page }) => {
  await page.goto(ROUTES.SPOTIFY_ARTIST_COLLAGE__INDEX);
  await expect(page).toHaveURL(ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN);
});

test("login button sends the user to Spotify", async ({ page }) => {
  // This redirect happens in the browser, so it can be stubbed here
  await page.route("https://accounts.spotify.com/**", (route) =>
    route.fulfill({ status: 200, body: "Spotify stub" }),
  );

  await page.goto(ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN);
  await page.getByRole("button", { name: "Log In With Spotify" }).click();
  await expect(page).toHaveURL(/accounts\.spotify\.com/);
});

test("GIF search shows the query @live", async ({ page }) => {
  await page.goto(`${ROUTES.GIFHUNTER_SEARCH}?p=cat`);
  await expect(page.getByLabel("Search for a GIF here")).toHaveValue("cat");
});
