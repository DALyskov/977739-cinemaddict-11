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

export {
  RenderPosition,
  createElm,
  render,
  remove,
};
