"use strict";

/** Portfolio fate-roll bootstrap — MajorVictory/3DDiceRoller, full viewport, no table surface. */
const params = new URLSearchParams(window.location.search);
const forcedResult = params.get("result") || String(Math.floor(Math.random() * 3) + 1);

/** Locked fate d4 appearance — Ice colorset, Stars texture, Glass material. */
const FATE_DIE = Object.freeze({
  colorset: "ice",
  texture: "stars",
  material: "glass",
  /** Louder than the roller UI max (100). */
  volume: 175,
});

function waitFor(getValue, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      try {
        const value = getValue();
        if (value) {
          resolve(value);
          return;
        }
      } catch {
        // DiceRoller still initializing.
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("MajorVictory dice roller failed to initialize"));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function notifyParent(result) {
  window.parent.postMessage(
    { type: "fate-roll-complete", result: parseInt(String(result), 10) },
    "*",
  );
}

function hideSpectrumUi() {
  document
    .querySelectorAll(
      ".sp-container, .sp-replacer, .sp-input-container, .sp-picker-container",
    )
    .forEach((el) => el.remove());

  if (window.$?.fn?.spectrum) {
    try {
      window.$(".control_fgcolor, .control_bgcolor").spectrum("hide");
      window.$(".control_fgcolor, .control_bgcolor").spectrum("destroy");
    } catch {
      // Spectrum may not be fully initialized yet.
    }
  }
}

function hideFateUi(room) {
  hideSpectrumUi();

  [
    "teal-chat",
    "info_div",
    "colorname",
    "labelhelp",
    "sethelp",
    "teal-userlist",
    "waitform",
    "control_panel",
    "control_panel_buttons",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.style.visibility = "hidden";
    }
  });

  if (room?.TealChat?.place) {
    room.TealChat.place.style.display = "none";
  }
  if (room?.TealChat?.text) {
    room.TealChat.text.innerHTML = "";
  }

  document
    .querySelectorAll(
      ".connection_message, .teal-chat-row, .teal-chat-row-own",
    )
    .forEach((el) => {
      el.style.display = "none";
    });
}

function ensureCanvasVisible(box) {
  if (!box?.container) return;
  box.container.style.opacity = "1";
  box.container.style.visibility = "visible";
}

function viewportHalfSize() {
  return {
    w: Math.max(Math.floor(window.innerWidth / 2), 220),
    h: Math.max(Math.floor(window.innerHeight / 2), 160),
  };
}

function updatePhysicsBarriers(box) {
  const hw = box.display.containerWidth * 0.93;
  const hh = box.display.containerHeight * 0.93;
  const planes = box.world.bodies.filter(
    (body) => body.mass === 0 && body.shapes[0]?.type === CANNON.Shape.types.PLANE,
  );

  if (planes.length < 5) return;

  planes[1].position.set(0, hh, 0);
  planes[2].position.set(0, -hh, 0);
  planes[3].position.set(hw, 0, 0);
  planes[4].position.set(-hw, 0, 0);
}

function ensureRendererTransparent(box) {
  if (!box.renderer) return;
  box.renderer.setClearColor(0x000000, 0);
  box.renderer.domElement.style.background = "transparent";
  box.renderer.domElement.style.backgroundColor = "transparent";
  box.renderer.shadowMap.enabled = false;
}

function removeTableSurface(box) {
  box.disableShadows();
  box.shadows = false;

  if (box.desk) {
    box.scene.remove(box.desk);
    if (box.desk.material) box.desk.material.dispose?.();
    box.desk = null;
  }
  if (box.pane) {
    box.scene.remove(box.pane);
    if (box.pane.material) box.pane.material.dispose?.();
    box.pane = null;
  }

  const shadowMeshes = [];
  box.scene.traverse((obj) => {
    if (obj.material && obj.material.type === "ShadowMaterial") {
      shadowMeshes.push(obj);
    }
  });
  shadowMeshes.forEach((mesh) => {
    box.scene.remove(mesh);
    if (mesh === box.desk) box.desk = null;
    if (mesh === box.pane) box.pane = null;
  });

  if (box.light) box.light.castShadow = false;
  if (box.diceList) {
    box.diceList.forEach((dicemesh) => {
      if (dicemesh) dicemesh.castShadow = false;
    });
  }

  ensureRendererTransparent(box);
}

function haltSelector(box, room) {
  box.running = false;
  box.clearDice();
  ensureCanvasVisible(box);
  removeTableSurface(box);

  box.showSelector = function showSelectorDisabled() {
    ensureCanvasVisible(box);
    removeTableSurface(box);
  };
  box.animateSelector = function animateSelectorDisabled() {
    ensureCanvasVisible(box);
  };
  if (room) {
    room.show_selector = function showSelectorDisabled() {
      ensureCanvasVisible(box);
    };
  }
}

function applyFateDieLook(dr) {
  dr.DiceColors.applyColorSet(
    FATE_DIE.colorset,
    FATE_DIE.texture,
    FATE_DIE.material,
    false,
  );

  dr.DiceFavorites.settings.colorset.value = FATE_DIE.colorset;
  dr.DiceFavorites.settings.texture.value = FATE_DIE.texture;
  dr.DiceFavorites.settings.material.value = FATE_DIE.material;

  const colorSelect = document.getElementById("color");
  const textureSelect = document.getElementById("texture");
  const materialSelect = document.getElementById("material");
  if (colorSelect) colorSelect.value = FATE_DIE.colorset;
  if (textureSelect) textureSelect.value = FATE_DIE.texture;
  if (materialSelect) materialSelect.value = FATE_DIE.material;
}

function patchDiceRoomUi(room, dr) {
  hideFateUi(room);

  const origApplyColorSet = dr.DiceColors.applyColorSet.bind(dr.DiceColors);
  dr.DiceColors.applyColorSet = function applyColorSetFateLocked() {
    origApplyColorSet(
      FATE_DIE.colorset,
      FATE_DIE.texture,
      FATE_DIE.material,
      false,
    );
    hideFateUi(room);
  };

  room.TealChat.add_unconfirmed_message = function () {};
  room.TealChat.confirm_message = function () {};
  room.TealChat.add_message = function () {};
  room.TealChat.add_info = function () {};

  const origLogin = room.actions.login.bind(room);
  room.actions.login = function loginQuiet(res) {
    origLogin(res);
    applyFateDieLook(window.DiceRoller);
    hideFateUi(room);
    ensureCanvasVisible(room.DiceBox);
  };

  const origSendNetworkedRoll = room.sendNetworkedRoll.bind(room);
  room.sendNetworkedRoll = function sendNetworkedRollQuiet(notationVectors) {
    hideFateUi(room);
    ensureCanvasVisible(this.DiceBox);
    applyFateDieLook(window.DiceRoller);
    if (this.info_div) this.info_div.style.display = "none";
    if (this.label) this.label.innerHTML = "";
    origSendNetworkedRoll(notationVectors);
    hideFateUi(room);
  };

  const origActionRoll = room.actions.roll.bind(room);
  room.actions.roll = function actionRollQuiet(res) {
    hideFateUi(room);
    ensureCanvasVisible(this.DiceBox);
    applyFateDieLook(window.DiceRoller);
    if (this.info_div) this.info_div.style.display = "none";
    if (this.label) this.label.innerHTML = "";
    res.colorset = FATE_DIE.colorset;
    res.texture = FATE_DIE.texture;
    res.material = FATE_DIE.material;
    origActionRoll(res);
    hideFateUi(room);
  };

  const origThemeChange = dr.on_theme_select_change.bind(dr);
  dr.on_theme_select_change = function onThemeSelectQuiet(ev, fgcolor, bgcolor) {
    origThemeChange(ev, fgcolor, bgcolor);
    applyFateDieLook(dr);
    hideSpectrumUi();
    hideFateUi(room);
  };
}

function patchDiceBox(box, room) {
  haltSelector(box, room);

  const origSetDimensions = box.setDimensions.bind(box);
  box.setDimensions = function setDimensionsNoTable(dimensions) {
    origSetDimensions(dimensions);
    removeTableSurface(box);
    ensureCanvasVisible(box);
  };

  const origSpawnDice = box.spawnDice.bind(box);
  box.spawnDice = function spawnDiceNoShadow(vector) {
    applyFateDieLook(window.DiceRoller);
    origSpawnDice(vector);
    const dicemesh = box.diceList[box.diceList.length - 1];
    if (dicemesh) dicemesh.castShadow = false;
    removeTableSurface(box);
    ensureCanvasVisible(box);
  };
}

function boostRollSounds(box, dr) {
  dr.DiceFavorites.settings.volume.value = String(FATE_DIE.volume);
  box.volume = FATE_DIE.volume;
  box.soundDelay = 6;

  const origCollide = box.eventCollide.bind(box);
  box.eventCollide = function eventCollideLouder(event) {
    dr.DiceFavorites.settings.volume.value = String(FATE_DIE.volume);
    origCollide(event);
  };
}

function fitViewport(box, room) {
  const { w, h } = viewportHalfSize();
  const desk = document.getElementById("desk");
  const widthPx = `${window.innerWidth}px`;
  const heightPx = `${window.innerHeight}px`;

  if (desk) {
    desk.style.width = widthPx;
    desk.style.height = heightPx;
    desk.style.background = "transparent";
  }
  if (room.canvas) {
    room.canvas.style.width = widthPx;
    room.canvas.style.height = heightPx;
    room.canvas.style.background = "transparent";
  }

  box.setDimensions({ w, h });
  updatePhysicsBarriers(box);
  removeTableSurface(box);
  ensureCanvasVisible(box);
  hideFateUi(room);
}

function enableSounds(box, dr) {
  dr.DiceFavorites.settings.sounds.value = "1";
  dr.DiceFavorites.settings.surface.value = "felt";
  dr.DiceFavorites.settings.shadows.value = "0";

  const soundsCheckbox = document.getElementById("checkbox_sounds");
  if (soundsCheckbox) soundsCheckbox.checked = true;

  const shadowsCheckbox = document.getElementById("checkbox_shadows");
  if (shadowsCheckbox) shadowsCheckbox.checked = false;

  const surfaceSelect = document.getElementById("surface");
  if (surfaceSelect) surfaceSelect.value = "felt";

  box.sounds = true;
  box.tally = false;
  boostRollSounds(box, dr);
}

function unlockAudio(box) {
  const peekVolume = 0.001;
  const clips = [
    ...box.sounds_dice,
    ...box.sounds_coins,
    ...Object.values(box.sounds_table).flat(),
  ];

  clips.forEach((clip) => {
    if (!clip || typeof clip.play !== "function") return;
    const previousVolume = clip.volume;
    clip.volume = peekVolume;
    const playAttempt = clip.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(() => {
          clip.pause();
          clip.currentTime = 0;
          clip.volume = previousVolume;
        })
        .catch(() => {
          clip.volume = previousVolume;
        });
    }
  });
}

function triggerFateRoll(room, forcedValue) {
  const notation = `1d4@${forcedValue}`;
  room.set.value = notation;
  applyFateDieLook(window.DiceRoller);
  ensureCanvasVisible(room.DiceBox);
  removeTableSurface(room.DiceBox);

  const notationVectors = room.DiceBox.startClickThrow(notation);
  if (!notationVectors || notationVectors.error) {
    console.error("Fate roll notation failed", notationVectors);
    notifyParent(forcedValue);
    return;
  }

  room.sendNetworkedRoll(notationVectors);
}

waitFor(() => window.DiceRoller)
  .then((dr) => {
    const loginform = document.getElementById("loginform");
    if (loginform) loginform.style.display = "none";

    dr.button_single_press();

    return waitFor(() => dr.DiceRoom && dr.DiceRoom.DiceBox).then(() => dr);
  })
  .then((dr) => {
    applyFateDieLook(dr);

    const room = dr.DiceRoom;
    const box = room.DiceBox;

    haltSelector(box, room);
    enableSounds(box, dr);
    patchDiceRoomUi(room, dr);
    patchDiceBox(box, room);
    fitViewport(box, room);
    hideSpectrumUi();
    unlockAudio(box);

    window.removeEventListener("resize", dr.on_window_resize);
    window.addEventListener("resize", () => fitViewport(box, room));

    window.addEventListener("message", (event) => {
      if (event.data?.type === "fate-unlock-audio") {
        unlockAudio(box);
      }
    });

    if (room.selector_div) room.selector_div.style.display = "none";

    const origRollDice = box.rollDice.bind(box);
    box.rollDice = function rollDiceWithNotify(notationVectors, callback) {
      hideFateUi(room);
      applyFateDieLook(dr);
      ensureCanvasVisible(box);
      return origRollDice(notationVectors, function onRollFinished(notation) {
        hideFateUi(room);
        ensureCanvasVisible(box);
        if (typeof callback === "function") {
          callback.call(this, notation);
        }

        const dice = box.diceList[0];
        const value = dice
          ? parseInt(dice.getLastValue().value, 10)
          : parseInt(forcedResult, 10);
        notifyParent(value);
      });
    };

    const spectrumObserver = new MutationObserver(() => hideSpectrumUi());
    spectrumObserver.observe(document.body, { childList: true, subtree: true });

    window.setTimeout(() => {
      haltSelector(box, room);
      hideFateUi(room);
      hideSpectrumUi();
      fitViewport(box, room);
      unlockAudio(box);
      triggerFateRoll(room, forcedResult);
    }, 400);
  })
  .catch((error) => {
    console.error(error);
    notifyParent(forcedResult);
  });
