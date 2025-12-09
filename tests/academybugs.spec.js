const { test, expect } = require('@playwright/test');

test.describe('Фінальний набір тестів для AcademyBugs.com', () => {
    
  test('Перевірка успішного переходу на сторінку товару', async ({ page }) => {
   
    // Крок 1: Відкриваємо сторінку зі списком усіх товарів
    await page.goto('https://academybugs.com/find-bugs/', {
    timeout: 120000,                // 60 секунд
    waitUntil: 'domcontentloaded'   // Чекаємо DOM без повного завантаження ресурсів
    });

    // Крок 2: Знаходимо посилання на товар "Blue Tshirt" і клікаємо на нього
    await page.getByRole('link', { name: 'Blue Tshirt' }).click();

    // Крок 3: Перевіряємо, що ми опинилися на правильній сторінці.
    // Очікуємо, що ПЕРШИЙ заголовок <h1> на новій сторінці буде містити потрібний текст.
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('Blue Tshirt');
  });

  test('Перевірка додавання товару в кошик', async ({ page }) => {
    
    // Крок 1: Відкриваємо сторінку товару "Blue Tshirt"
    await page.goto('https://academybugs.com/store/blue-tshirt/', {
    timeout: 120000,
    waitUntil: 'domcontentloaded'
    });

    // Крок 2: Натискаємо на кнопку додавання товару у кошик
    await page.getByRole('button', { name: 'ADD TO CART' }).click();

    // Крок 3: Перевіряємо, що нас перекинуло на сторінку кошика
    await expect(page).toHaveURL(/.*my-cart/);

    // Крок 4: Перевіряємо, що на сторінці кошика є посилання з точною назвою товару
    const productInCart = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(productInCart).toBeVisible();
  });

  test('Перевірка видалення товару з кошика', async ({ page }) => {
  
    // Відкриваємо сторінку товару
    await page.goto('https://academybugs.com/store/blue-tshirt/', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    // Додаємо товар у кошик
    await page.getByRole('button', { name: 'ADD TO CART' }).click();
    await expect(page).toHaveURL(/.*my-cart/);

    // Перевіряємо, що на сторінці кошика є посилання з точною назвою товару
    const product = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(product).toBeVisible();

    // Локатор рядка товару в кошику
    const productRow = page.locator('.ec_cartitem_row', {
      has: product
    });

    // Знаходимо кнопку видалення саме цього товару
    const removeBtn = productRow.locator('.ec_cartitem_delete');
    await expect(removeBtn).toBeVisible();

    // Видаляємо
    await removeBtn.click();

    // Перевіряємо, що рядок товару зник
    await expect(productRow).toHaveCount(0, { timeout: 15000 });

  });

  test('Успішне оформлення замовлення', async ({ page }) => {

    // Відкриваємо сторінку товару
    await page.goto('https://academybugs.com/store/blue-tshirt/', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    // Додаємо товар у кошик
    await page.getByRole('button', { name: 'ADD TO CART' }).click();
    await expect(page).toHaveURL(/.*my-cart/);

    // Перевіряємо, що на сторінці кошика є посилання з точною назвою товару
    const product = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(product).toBeVisible();

    // Переходимо на оформлення замовлення
    await page.getByRole('link', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/.*checkout/);

    // Заповнюємо форму   
    await page.locator('#ec_cart_billing_country').selectOption({ value: 'UA' });
    await page.locator('#ec_cart_billing_first_name').fill('Daria');
    await page.locator('#ec_cart_billing_last_name').fill('Bryzh');
    await page.locator('#ec_cart_billing_city').fill('Odesa');
    await page.locator('#ec_cart_billing_address').fill('1st Avenue 12');
    await page.locator('#ec_cart_billing_zip').fill('10001');
    await page.locator('#ec_cart_billing_phone').fill('123456789');
    await page.locator('#ec_contact_email').fill('test123@example.com');
    await page.locator('#ec_contact_email_retype').fill('test123@example.com');

    // Переходимо до вибору доставки
    await page.getByRole('button', { name: 'CONTINUE TO SHIPPING' }).first().click();
    await expect(page).toHaveURL(/checkout_shipping/);

    // Чекаємо хоча б одну опцію доставки
    const shippingOption = page.locator('input[name="ec_cart_shipping_method"]').first();
    await expect(shippingOption).toBeVisible({ timeout: 60000 });

    // Обираємо певну опцію за value
    await page.locator('input[name="ec_cart_shipping_method"][value="52"]').check();

    // Переходимо до оплати (підтвердження замовлення)
    await page.getByRole('button', { name: 'CONTINUE TO PAYMENT' }).click();
    await expect(page).toHaveURL(/checkout_payment/);

    // Перевіряємо наявність кнопки фінального оформлення
    await expect(page.locator('#ec_cart_submit_order')).toBeVisible({ timeout: 30000 });
  });

});



