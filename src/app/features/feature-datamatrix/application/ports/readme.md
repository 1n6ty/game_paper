**IUseCaseOutputPort** (который мы удалили). Он описывал, как use-case отчитывается о результатах.

```ts
import AppError from "../../../shared-kernel/domain/errors/AppError";

/**
 * Универсальный выходной порт для всех use-кейсов.
 * @template T - Тип данных при успешном выполнении.
 */
export default interface IUseCaseOutputPort<T> {
  onSuccess(result: T): void;
  onFailure(error: AppError): void;
}
```

**IUseCaseInputPort** (если бы мы использовали классы для use-кейсов, этот интерфейс описывал бы метод execute и его параметры). В нашем случае роль этого порта выполняет сама сигнатура функции use-кейса.

```ts
/**
 * Универсальный входной порт для всех use-кейсов.
 * @template T - Тип входных данных.
 */
export default interface IUseCaseInputPort<T> {
  execute(data: T);
}
```
