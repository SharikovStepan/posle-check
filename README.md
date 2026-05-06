# ПослеЧек

Сервис для учета общих расходов, который избавляет от необходимости помнить, кто и сколько должен.
Вы спокойно распределяете суммы между друзьями уже **после** того, как оплачен общий чек, и приложение сохраняет эти записи в виде понятной истории долгов.
> Не взаимодействует с банками и переводами - просто записи

[posle-check.vercel.app](https://posle-check.vercel.app)

---
## Интерфейс приложения

<p align="center">
  <img src="previewContent/checkCard.png" width="30%" alt="Группа">
  <img src="previewContent/confirm.png" width="30%" alt="Подтвеждение платежа">
  <img src="previewContent/toPay.png" width="30%" alt="Оплата чека">
</p>

---
## Основные возможности

* **Друзья и группы:** Можно добавлять пользователей в друзья и объединять их в группы для разных событий или поездок.
* **Распределение чека:** 
  * Деление общей суммы поровну на всех участников.
  * Ручное распределение разных сумм на каждого человека.
  * Возможность отдельно распределить доставку/чаевые, если они есть.
  * Можно оставить сумму на усмотрение участника(Он сам знает, сколько должен)
* **Авторизация:** Вход через Google или Яндекс (реализовано с помощью NextAuth).
* **Mobile First:** Удобное использование на мобильных устройствах.

---

## Демонстрация работы

Так как приложение требует авторизации и наличия связей между пользователями, ниже представлены основные этапы работы с интерфейсом:
* **Добавление друзей**
  * <details>
      <summary><b>Найдите друга по Email</b></summary>
      <br>
      <img src="previewContent/addFriend.gif" alt="Найти друга">
    </details>
  * <details>
      <summary><b>Дождитесь подтверждения от друга</b></summary>
      <br>
      <img src="previewContent/confirmFriend.gif" alt="Подтверждение дружбы">
    </details>

* **Создание группы**
  * <details>
      <summary><b>Начните создание и введите название</b></summary>
      <br>
      <img src="previewContent/createGroupName.gif" alt="Название группы">
    </details>
  * <details>
      <summary><b>Добавьте друзей</b></summary>
      <br>
      <img src="previewContent/addMembers.gif" alt="Добавление друзей в группу">
    </details>
  * <details>
      <summary><b>Дождитесь принятия приглашения</b></summary>
      <br>
      <img src="previewContent/confrimInviteGroup.gif" alt="Принять приглашение">
    </details>

* **Создание чека**
  * <details>
      <summary><b>Начните создание, введите название и полную сумму</b></summary>
      <br>
      <img src="previewContent/createCheckNameAmount.gif" alt="Название и сумма чека">
    </details>
  * <details>
      <summary><b>Выберите участников чека (если не все)</b></summary>
      <br>
      <img src="previewContent/addParticipants.gif" alt="Выбор участников">
    </details>
  * <details>
      <summary><b>Распределите суммы (Например, поровну)</b></summary>
      <br>
      <img src="previewContent/splitAmount.gif" alt="Разделение суммы">
    </details>
  * <details>
      <summary><b>Проверьте данные</b></summary>
      <br>
      <img src="previewContent/confirmCheckCreate.gif" alt="Финальные данные чека">
    </details>

* **Взаимодействие с чеком**
  * <details>
      <summary><b>Ваш друг информирует об оплате</b></summary>
      <br>
      <img src="previewContent/friendPaying.gif" alt="оплатить">
    </details>
  * <details>
      <summary><b>Вы подтверждаете его оплату</b></summary>
      <br>
      <img src="previewContent/confirmPayment.gif" alt="подтвердить платёж">
    </details>

---

## Технический стек

Проект построен на актуальном стеке с акцентом на серверный рендеринг:

* **Framework:** Next.js (App Router)
* **Язык:** TypeScript
* **Стили:** Tailwind CSS
* **Анимации:** Motion (Framer Motion)
* **Авторизация:** NextAuth.js (OAuth: Google, Yandex)
* **База данных:** Neon (PostgreSQL)
* **Работа с БД:** Postgres.js

---

## Особенности реализации

* **Логика расчетов:** Математический расчет долей реализован на стороне клиента с последующей валидацией на сервере перед записью в базу данных.
* **Server Actions:** Взаимодействие с базой данных и обновление интерфейса реализовано через серверные действия Next.js.
* **SQL:** Запросы к базе написаны на чистом SQL через postgres.js для лучшего контроля.

## Контакты

По всем вопросам, предложениям и багрепортам:

- **Telegram:** [@sharikov_stepan](https://t.me/sharikov_stepan)
- **Email:** Stepkoy@live.com

---