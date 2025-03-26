import Countdown from "./ts/Countdown.js";

const rootDiv = document.querySelector('#app') as HTMLDivElement;
const navbarItems = document.querySelectorAll<HTMLAnchorElement>('a[data-href]');

const PAGES = '/pages/';

interface Route {
  page: string;
  code?: new () => any;
}

const routes: Record<string, Route> = {
  '/': { page: 'home.html', code: Countdown },
  '/champ': { page: 'champ.html', code: undefined },
  '/weapon': { page: 'weapon.html', code: undefined }
};

const loadPage = async (page: string): Promise<string> => {
  const response = await fetch(PAGES + page);
  const resHtml = await response.text();
  return resHtml;
};

const dynamicClass = (CodeClass?: new () => void): void => {
  if (CodeClass) {
    new CodeClass();
  }
};

const onNavClick = async (event: MouseEvent): Promise<void> => {
  event.preventDefault();
  const target = event.target as HTMLAnchorElement;
  const pathName = target.dataset.href as string;
  window.history.pushState({}, '', pathName);
  const data = await loadPage(routes[pathName].page);
  rootDiv.innerHTML = data;
  dynamicClass(routes[pathName]?.code);
};

window.addEventListener('load', async () => {
  const pathName = window.location.pathname;
  const data = await loadPage(routes[pathName].page);
  rootDiv.innerHTML = data;
  dynamicClass(routes[pathName].code);
});

window.addEventListener('popstate', async () => {
  const pathName = window.location.pathname;
  const data = await loadPage(routes[pathName].page);
  rootDiv.innerHTML = data;
  dynamicClass(routes[pathName].code);
});

navbarItems.forEach(navItem => {
  navItem.addEventListener('click', onNavClick);
});