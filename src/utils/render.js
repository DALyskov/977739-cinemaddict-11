const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElm = (template) => {
  const newElm = document.createElement(`div`);
  newElm.innerHTML = template;

  return newElm.firstChild;
};

const render = (container, component, place = `beforeend`) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElm());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElm());
      break;
  }
};

const remove = (component) => {
  component.getElm().remove();
  component.removeElm();
};

const replace = (newComponent, oldComponent) => {
  const parentElm = oldComponent.getElm().parentElement;
  const newElm = newComponent.getElm();
  const oldElm = oldComponent.getElm();

  const isExistElements = !!(parentElm && newElm && oldElm);

  if (isExistElements && parentElm.contains(oldElm)) {
    parentElm.replaceChild(newElm, oldElm);
    console.log(`replaceChild`);
    console.log(newElm);
  }
};

export {
  RenderPosition,
  createElm,
  render,
  remove,
  replace,
};
