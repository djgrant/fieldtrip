import { BrowserHistory } from "history";
import globalHistory from "history/browser";
import { useNavigate, matchPath } from "react-router-dom";

interface NavigateOptions {
  replace?: boolean;
  state?: any;
}

export const router = {
  location(history = globalHistory) {
    return history.location;
  },

  async listen(subscriber: (...args: any) => void) {
    const onRouteChange = async (history: BrowserHistory) => {
      await subscriber(router.location(history));
    };
    await onRouteChange(globalHistory);
    globalHistory.listen((history) => onRouteChange(history as any));
  },

  async match(path: string, subscriber: (...args: any) => void) {
    await router.listen(async (args) => {
      const match = matchPath(path, args.pathname);
      if (match) {
        await subscriber(match);
      }
    });
  },
};
