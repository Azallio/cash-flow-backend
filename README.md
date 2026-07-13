# Cash Flow Backend

NestJS backend for the Cash Flow personal finance application.

---

## Общее

- Все эндпоинты, кроме `/auth/*`, требуют JWT-аутентификации: `Authorization: Bearer <accessToken>`
- Все ответы оборачиваются в единый формат:
  ```json
  { "data": <payload>, "statusCode": 200, "message": "..." }
  ```
  Пагинируемые списки: `{ "data": [...], "total": N, "take": 20, "skip": 0 }`
- Параметры пагинации (query): `take` (default `20`, min `1`), `skip` (default `0`, min `0`)

---

## Auth — `/auth`

### `POST /auth/register`

Регистрация нового пользователя.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `email` | `string` | ✓ | Email пользователя |
| `password` | `string` | ✓ | Минимум 8 символов |

**Ответ `201`:**

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Ошибки:** `400` — невалидные данные, `409` — пользователь с таким email уже существует

---

### `POST /auth/login`

Аутентификация существующего пользователя.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `email` | `string` | ✓ | Email пользователя |
| `password` | `string` | ✓ | Минимум 6 символов |

**Ответ `200`:**

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Ошибки:** `401` — неверные credentials

---

### `POST /auth/refresh`

Обновление пары токенов по refresh-токену.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `refreshToken` | `string` | ✓ | Действующий refresh-токен |

**Ответ `200`:** Такой же формат, как у login.

**Ошибки:** `401` — невалидный или просроченный refresh-токен

---

## Users — `/users`

> Все эндпоинты требуют JWT.

### `GET /users/me`

Возвращает данные текущего аутентифицированного пользователя из JWT.

**Ответ `200`:**

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "createdAt": "2026-06-02T10:00:00.000Z",
  "updatedAt": "2026-06-02T10:00:00.000Z"
}
```

---

### `GET /users`

Список всех пользователей (с пагинацией). Требует роли администратора.

**Query:** `take`, `skip`

**Ответ `200`:** Пагинируемый массив объектов `UserResponse`.

---

### `DELETE /users/:id`

Удаление пользователя по ID.

**Params:** `id` — числовой ID пользователя

**Ответ `200`:** пустой `data: null`

**Ошибки:** `404` — пользователь не найден

---

## Categories — `/category`

> Все эндпоинты требуют JWT. Операции изолированы по пользователю — чужие категории недоступны.

### `POST /category`

Создание категории для текущего пользователя.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `title` | `string` | ✓ | Название категории |
| `transactionType` | `"expense" \| "income"` | ✓ | Тип транзакций категории |
| `description` | `string` | — | Описание |

**Ответ `201`:**

```json
{
  "id": 1,
  "title": "Food",
  "description": "Category for food expenses",
  "transactionType": "expense",
  "createdAt": "2026-06-02T10:00:00.000Z",
  "updatedAt": "2026-06-02T10:00:00.000Z"
}
```

**Ошибки:** `400` — невалидные данные

---

### `GET /category`

Все категории текущего пользователя (с пагинацией).

**Query:** `take`, `skip`

**Ответ `200`:** Пагинируемый массив объектов `CategoryResponse`.

---

### `GET /category/:id`

Категория по ID.

**Params:** `id`

**Ответ `200`:** Объект `CategoryResponse`.

**Ошибки:** `404` — не найдена

---

### `PATCH /category/:id`

Обновление категории.

**Params:** `id`

**Body:** любые поля из `CreateCategoryRequest` (все опциональны): `title`, `transactionType`, `description`

**Ответ `200`:** Обновлённый объект `CategoryResponse`.

**Ошибки:** `404` — не найдена

---

### `DELETE /category/:id`

Удаление категории по ID.

**Params:** `id`

**Ответ `200`:** пустой `data: null`

**Ошибки:** `404` — не найдена

---

## Transactions — `/transactions`

> Все эндпоинты требуют JWT. Транзакции изолированы по пользователю.

### `POST /transactions`

Создание новой транзакции.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `categoryId` | `number` | ✓ | ID категории |
| `amount` | `number` | ✓ | Сумма (целое) |
| `transactionType` | `"expense" \| "income"` | ✓ | Тип транзакции |
| `description` | `string` | — | Описание |
| `createdAt` | `string` (ISO 8601) | — | Дата операции (можно указать задним числом) |

**Ответ `201`:**

```json
{
  "id": 1,
  "transactionType": "income",
  "amount": 5000,
  "description": "Salary for June",
  "categoryId": 2,
  "userId": 1,
  "createdAt": "2026-06-01T00:00:00.000Z",
  "updatedAt": "2026-06-01T00:00:00.000Z"
}
```

---

### `GET /transactions`

Все транзакции текущего пользователя (с пагинацией и фильтрацией).

**Query:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `take` | `number` | default `20` |
| `skip` | `number` | default `0` |
| `transactionType` | `"expense" \| "income"` | Фильтр по типу |
| `startDate` | ISO 8601 | Начало диапазона дат |
| `endDate` | ISO 8601 | Конец диапазона дат |

**Ответ `200`:** Пагинируемый массив объектов `TransactionResponse`.

---

### `GET /transactions/category/:categoryId`

Транзакции по конкретной категории (с пагинацией).

**Params:** `categoryId`

**Query:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `take` | `number` | default `20` |
| `skip` | `number` | default `0` |
| `transactionType` | `"expense" \| "income"` | Фильтр по типу |

**Ответ `200`:** Пагинируемый массив объектов `TransactionResponse`.

---

### `GET /transactions/:id`

Транзакция по ID.

**Params:** `id`

**Ответ `200`:** Объект `TransactionResponse`.

**Ошибки:** `404` — не найдена

---

### `PATCH /transactions/:id`

Обновление транзакции.

**Params:** `id`

**Body:** любые поля из `CreateTransactionRequest` (все опциональны)

**Ответ `200`:** Обновлённый объект `TransactionResponse`.

**Ошибки:** `404` — не найдена

---

### `DELETE /transactions/:id`

Удаление транзакции.

**Params:** `id`

**Ответ `200`:** Удалённый объект `TransactionResponse`.

**Ошибки:** `404` — не найдена

---

## Budget — `/budget`

> Все эндпоинты требуют JWT.

### Концепции

| Сущность                  | Описание                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `BudgetEntity`            | Лимит расходов по одной категории за период. Для `MONTHLY` хранится `month` (первое число месяца, UTC). |
| `MonthlyBudgetPlanEntity` | Финансовый план на месяц: `projectedIncome`, уникален по `(user, month)`.                               |
| `BudgetAdjustmentEntity`  | Аудит-лог каждой операции extend/freeze-reallocate.                                                     |
| `BudgetPeriod`            | `monthly` — единственный поддерживаемый период.                                                         |
| `AdjustmentSource`        | `income_increase` — доход вырос; `budget_reallocation` — перераспределение между бюджетами.             |

---

### `GET /budget/category/:categoryId`

Активный бюджет текущего месяца для указанной категории с вычисленными полями.

**Params:** `categoryId`

**Ответ `200`:**

```json
{
  "budgetId": 1,
  "categoryId": 3,
  "period": "monthly",
  "limitAmount": "15000.00",
  "collectedAmount": "8500.00",
  "remaining": "6500.00",
  "isActive": true,
  "isAutoGenerated": false
}
```

**Ошибки:** `400` — категория не является EXPENSE, `404` — категория или бюджет не найдены

---

### `GET /budget/plan/current`

Финансовый план на текущий месяц с вычисленными агрегатами.

**Ответ `200`:**

```json
{
  "id": 1,
  "month": "2026-07-01",
  "projectedIncome": "80000.00",
  "totalAllocated": "55000.00",
  "available": "25000.00"
}
```

- `totalAllocated` — сумма лимитов всех активных MONTHLY-бюджетов текущего месяца
- `available` — `projectedIncome - totalAllocated`

---

### `POST /budget/generate`

Запускает автоматическую генерацию MONTHLY-бюджетов для всех EXPENSE-категорий пользователя на текущий месяц (если ещё не созданы). Лимиты рассчитываются на основе трат предыдущего месяца с поправкой на платёжеспособность. Идемпотентно.

**Ответ `200`:** пустой `data: null`

**Ошибки:** `401` — не авторизован

---

### `PATCH /budget/:id/freeze`

Заморозка бюджета (`isActive = false`).

**Params:** `id` — ID бюджета

**Ответ `200`:** пустой `data: null`

**Ошибки:** `404` — бюджет не найден

---

### `PATCH /budget/:id/unfreeze`

Разморозка бюджета (`isActive = true`). Отрицательный `available` допустим и возвращается как предупреждение.

**Params:** `id` — ID бюджета

**Ответ `200`:** пустой `data: null`

**Ошибки:** `404` — бюджет не найден

---

### `POST /budget/:id/extend`

Увеличение лимита бюджета. Источник увеличения — либо новый доход (`income_increase`), либо перераспределение из другого бюджета (`budget_reallocation`).

**Params:** `id` — ID целевого бюджета

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `amount` | `string` (decimal) | ✓ | Сумма увеличения, например `"500.00"` |
| `source` | `"income_increase" \| "budget_reallocation"` | ✓ | Источник |
| `sourceBudgetId` | `number` | Если `source = budget_reallocation` | ID бюджета-донора |
| `reason` | `string` | — | Причина |

**Ответ `200`:** пустой `data: null`

**Ошибки:** `400` — при `budget_reallocation` сумма превышает оставшийся лимит донора, `404` — бюджет не найден

---

### `POST /budget/freeze-reallocate`

Замораживает бюджет-донор и переносит его оставшийся лимит в целевой бюджет одной атомарной операцией.

**Body:**
| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `fromBudgetId` | `number` | ✓ | ID бюджета, который нужно заморозить |
| `toBudgetId` | `number` | ✓ | ID бюджета, получающего лимит |

**Ответ `200`:** пустой `data: null`

**Ошибки:** `404` — один из бюджетов не найден

---

## Enums

| Enum               | Значения                                 |
| ------------------ | ---------------------------------------- |
| `TransactionType`  | `expense`, `income`                      |
| `BudgetPeriod`     | `monthly`                                |
| `AdjustmentSource` | `income_increase`, `budget_reallocation` |
| `AnalyticPeriod`   | `day`, `month`, `year`                   |

---

## Swagger UI
