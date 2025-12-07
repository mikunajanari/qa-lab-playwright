const { test, expect } = require('@playwright/test');


test.describe('Фінальний набір тестів для AcademyBugs.com', () => {
    
    // @ts-check
    test('Перевірка успішного переходу на сторінку товару', async ({ page }) => {
   
 // Крок 1: Відкриваємо сторінку зі списком усіх товарів
    await page.goto('https://academybugs.com/find-bugs/', {
    timeout: 120000,   // 60 секунд
    waitUntil: 'domcontentloaded'
    });

    // Крок 2: Знаходимо посилання на товар "Blue Tshirt" і клікаємо на нього
    await page.getByRole('link', { name: 'Blue Tshirt' }).click();

    // Крок 3: Перевіряємо, що ми опинилися на правильній сторінці.
    // Очікуємо, що ПЕРШИЙ заголовок <h1> на новій сторінці буде містити потрібний текст.
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('Blue Tshirt');
  });

  // @ts-check
   test('Перевірка додавання товару в кошик', async ({ page }) => {
    // Крок 1: Відкриваємо сторінку товару "Blue Tshirt"
    await page.goto('https://academybugs.com/store/blue-tshirt/', {
    timeout: 120000,   // 60 секунд
    waitUntil: 'domcontentloaded'
    });

    // Крок 2: Натискаємо на кнопку "ADD TO CART".
    await page.getByRole('button', { name: 'ADD TO CART' }).click();

    // Крок 3: Перевіряємо, що нас перекинуло на сторінку кошика.
    await expect(page).toHaveURL(/.*my-cart/);

    // Крок 4: Перевіряємо, що на сторінці кошика є посилання з точною назвою товару.
    const productInCart = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(productInCart).toBeVisible();
  });

    test('Перевірка видалення товару з кошика', async ({ page }) => {
  
    await page.goto('https://academybugs.com/store/blue-tshirt/', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    // Додаємо в кошик
    await page.getByRole('button', { name: 'ADD TO CART' }).click();
    await expect(page).toHaveURL(/.*my-cart/);

    // Переконуємось, що товар є
    const product = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(product).toBeVisible();

    // Локатор рядка товару в кошику (ТОЧКОВИЙ)
    const productRow = page.locator('.ec_cartitem_row', {
      has: product
    });

    // Знаходимо кнопку видалення саме цього товару
    const removeBtn = productRow.locator('.ec_cartitem_delete');
    await expect(removeBtn).toBeVisible();

    // Видаляємо
    await removeBtn.click();

    // Перевіряємо, що рядок товару більше не існує
    await expect(productRow).toHaveCount(0, { timeout: 15000 });

  });

});



