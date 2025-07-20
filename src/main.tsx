import "./app/shared-kernel/infrastructure/i18n/i18n";
import "./app/shared-kernel/ui/styles/global.css";

declare const __APP_TARGET__: "base" | "santekh" | "mock"; // все сборки

const bootstrap = async () => {
  switch (__APP_TARGET__) {
    case "mock":
      await import("./prod/mock");
      break;
    case "santekh":
    case "base":
    default:
      await import("./prod/base");
      break;
  }
};

bootstrap();
