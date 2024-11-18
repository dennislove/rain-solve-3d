export const switchAnimation = (mixer, newAnimation) => {
  if (!mixer || !newAnimation) return;

  // Fade out all current actions
  const actions = mixer._actions;
  actions.forEach((action) => {
    action.fadeOut(0.2); // Smoothly fade out current animation
  });

  // Fade in the new action
  const newAction = mixer.clipAction(newAnimation);
  newAction.reset().fadeIn(0.2).play(); // Smoothly fade in new animation
};
