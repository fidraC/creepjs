import AES from "crypto-js/aes";
import getOfflineAudioContext from "./audio";
import getCanvas2d from "./canvas";
import getCSS from "./css";
import getCSSMedia from "./cssmedia";
import getHTMLElementVersion from "./document";
import getClientRects from "./domrect";
import getConsoleErrors from "./engine";
import { timer, getCapturedErrors, caniuse } from "./errors";
import getEngineFeatures, { getFeaturesLie } from "./features";
import getFonts from "./fonts";
import getHeadlessFeatures from "./headless";
import getIntl from "./intl";
import { getLies, PARENT_PHANTOM, PROTO_BENCHMARK } from "./lies";
import getMaths from "./math";
import getMedia from "./media";
import getNavigator from "./navigator";
import getResistance from "./resistance";
import { getRawFingerprint } from "./samples";
import getScreen from "./screen";
import getVoices from "./speech";
import { getStatus, getStorage } from "./status";
import getSVG from "./svg";
import getTimezone from "./timezone";
import { getTrash } from "./trash";
import {
  hashify,
  hashMini,
  getBotHash,
  getFuzzyHash,
  cipher,
} from "./utils/crypto";
import { exile, getStackBytes, getTTFB, measure } from "./utils/exile";
import {
  IS_BLINK,
  braveBrowser,
  getBraveMode,
  getBraveUnprotectedParameters,
  computeWindowsRelease,
  hashSlice,
  LowerEntropy,
  queueTask,
  Analysis,
} from "./utils/helpers";
import getCanvasWebgl from "./webgl";
import getWebRTCData, { getWebRTCDevices } from "./webrtc";
import getWindowFeatures from "./window";
import getBestWorkerScope, { Scope, spawnWorker } from "./worker";

export async function getCreep() {
  "use strict";

  const scope = await spawnWorker();

  if (scope == Scope.WORKER) {
    return;
  }

  await queueTask();
  const stackBytes = getStackBytes();
  const [, measuredTime, ttfb] = await Promise.all([
    exile(),
    measure(),
    getTTFB(),
  ]);
  console.clear();
  const measured =
    outerWidth - innerWidth < 150 && outerHeight - innerHeight < 150
      ? measuredTime
      : 0;

  const isBrave = IS_BLINK ? await braveBrowser() : false;
  const braveMode = isBrave ? getBraveMode() : {};
  const braveFingerprintingBlocking =
    isBrave && (braveMode.standard || braveMode.strict);

  const fingerprint = async () => {
    const timeStart = timer();
    const fingerprintTimeStart = timer();
    // @ts-ignore
    const [
      workerScopeComputed,
      voicesComputed,
      offlineAudioContextComputed,
      canvasWebglComputed,
      canvas2dComputed,
      windowFeaturesComputed,
      htmlElementVersionComputed,
      cssComputed,
      cssMediaComputed,
      screenComputed,
      mathsComputed,
      consoleErrorsComputed,
      timezoneComputed,
      clientRectsComputed,
      fontsComputed,
      mediaComputed,
      svgComputed,
      resistanceComputed,
      intlComputed,
    ] = await Promise.all([
      getBestWorkerScope(),
      getVoices(),
      getOfflineAudioContext(),
      getCanvasWebgl(),
      getCanvas2d(),
      getWindowFeatures(),
      getHTMLElementVersion(),
      getCSS(),
      getCSSMedia(),
      getScreen(),
      getMaths(),
      getConsoleErrors(),
      getTimezone(),
      getClientRects(),
      getFonts(),
      getMedia(),
      getSVG(),
      getResistance(),
      getIntl(),
    ]).catch((error) => console.error(error.message));

    const navigatorComputed = await getNavigator(workerScopeComputed).catch(
      (error) => console.error(error.message)
    );

    // @ts-ignore
    const [headlessComputed, featuresComputed] = await Promise.all([
      getHeadlessFeatures({
        webgl: canvasWebglComputed,
        workerScope: workerScopeComputed,
      }),
      getEngineFeatures({
        cssComputed,
        navigatorComputed,
        windowFeaturesComputed,
      }),
    ]).catch((error) => console.error(error.message));

    // @ts-ignore
    const [liesComputed, trashComputed, capturedErrorsComputed] =
      await Promise.all([getLies(), getTrash(), getCapturedErrors()]).catch(
        (error) => console.error(error.message)
      );

    const fingerprintTimeEnd = fingerprintTimeStart();
    console.log(
      `Fingerprinting complete in ${fingerprintTimeEnd.toFixed(2)}ms`
    );

    // GPU Prediction
    const { parameters: gpuParameter } = canvasWebglComputed || {};
    const reducedGPUParameters = {
      ...(braveFingerprintingBlocking
        ? getBraveUnprotectedParameters(gpuParameter)
        : gpuParameter),
      RENDERER: undefined,
      SHADING_LANGUAGE_VERSION: undefined,
      UNMASKED_RENDERER_WEBGL: undefined,
      UNMASKED_VENDOR_WEBGL: undefined,
      VERSION: undefined,
      VENDOR: undefined,
    };

    // Hashing
    const hashStartTime = timer();
    // @ts-ignore
    const [
      windowHash,
      headlessHash,
      htmlHash,
      cssMediaHash,
      cssHash,
      styleHash,
      styleSystemHash,
      screenHash,
      voicesHash,
      canvas2dHash,
      canvas2dImageHash,
      canvas2dPaintHash,
      canvas2dTextHash,
      canvas2dEmojiHash,
      canvasWebglHash,
      canvasWebglImageHash,
      canvasWebglParametersHash,
      pixelsHash,
      pixels2Hash,
      mathsHash,
      consoleErrorsHash,
      timezoneHash,
      rectsHash,
      domRectHash,
      audioHash,
      fontsHash,
      workerHash,
      mediaHash,
      mimeTypesHash,
      navigatorHash,
      liesHash,
      trashHash,
      errorsHash,
      svgHash,
      resistanceHash,
      intlHash,
      featuresHash,
      deviceOfTimezoneHash,
    ] = await Promise.all([
      hashify(windowFeaturesComputed),
      hashify(headlessComputed),
      hashify((htmlElementVersionComputed || {}).keys),
      hashify(cssMediaComputed),
      hashify(cssComputed),
      hashify((cssComputed || {}).computedStyle),
      hashify((cssComputed || {}).system),
      hashify(screenComputed),
      hashify(voicesComputed),
      hashify(canvas2dComputed),
      hashify((canvas2dComputed || {}).dataURI),
      hashify((canvas2dComputed || {}).paintURI),
      hashify((canvas2dComputed || {}).textURI),
      hashify((canvas2dComputed || {}).emojiURI),
      hashify(canvasWebglComputed),
      hashify((canvasWebglComputed || {}).dataURI),
      hashify(reducedGPUParameters),
      ((canvasWebglComputed || {}).pixels || []).length
        ? hashify(canvasWebglComputed.pixels)
        : undefined,
      ((canvasWebglComputed || {}).pixels2 || []).length
        ? hashify(canvasWebglComputed.pixels2)
        : undefined,
      hashify((mathsComputed || {}).data),
      hashify((consoleErrorsComputed || {}).errors),
      hashify(timezoneComputed),
      hashify(clientRectsComputed),
      hashify([
        (clientRectsComputed || {}).elementBoundingClientRect,
        (clientRectsComputed || {}).elementClientRects,
        (clientRectsComputed || {}).rangeBoundingClientRect,
        (clientRectsComputed || {}).rangeClientRects,
      ]),
      hashify(offlineAudioContextComputed),
      hashify(fontsComputed),
      hashify(workerScopeComputed),
      hashify(mediaComputed),
      hashify((mediaComputed || {}).mimeTypes),
      hashify(navigatorComputed),
      hashify(liesComputed),
      hashify(trashComputed),
      hashify(capturedErrorsComputed),
      hashify(svgComputed),
      hashify(resistanceComputed),
      hashify(intlComputed),
      hashify(featuresComputed),
      hashify(
        (() => {
          const {
            bluetoothAvailability,
            device,
            deviceMemory,
            hardwareConcurrency,
            maxTouchPoints,
            oscpu,
            platform,
            system,
            userAgentData,
          } = navigatorComputed || {};
          const {
            architecture,
            bitness,
            mobile,
            model,
            platform: uaPlatform,
            platformVersion,
          } = userAgentData || {};
          const { "any-pointer": anyPointer } =
            cssMediaComputed?.mediaCSS || {};
          const { colorDepth, pixelDepth, height, width } =
            screenComputed || {};
          const { location, locationEpoch, zone } = timezoneComputed || {};
          const {
            deviceMemory: deviceMemoryWorker,
            hardwareConcurrency: hardwareConcurrencyWorker,
            gpu,
            platform: platformWorker,
            system: systemWorker,
            timezoneLocation: locationWorker,
            userAgentData: userAgentDataWorker,
          } = workerScopeComputed || {};
          const { compressedGPU, confidence } = gpu || {};
          const {
            architecture: architectureWorker,
            bitness: bitnessWorker,
            mobile: mobileWorker,
            model: modelWorker,
            platform: uaPlatformWorker,
            platformVersion: platformVersionWorker,
          } = userAgentDataWorker || {};

          return [
            anyPointer,
            architecture,
            architectureWorker,
            bitness,
            bitnessWorker,
            bluetoothAvailability,
            colorDepth,
            ...(compressedGPU && confidence != "low" ? [compressedGPU] : []),
            device,
            deviceMemory,
            deviceMemoryWorker,
            hardwareConcurrency,
            hardwareConcurrencyWorker,
            height,
            location,
            locationWorker,
            locationEpoch,
            maxTouchPoints,
            mobile,
            mobileWorker,
            model,
            modelWorker,
            oscpu,
            pixelDepth,
            platform,
            platformWorker,
            platformVersion,
            platformVersionWorker,
            system,
            systemWorker,
            uaPlatform,
            uaPlatformWorker,
            width,
            zone,
          ];
        })()
      ),
    ]).catch((error) => console.error(error.message));

    // console.log(performance.now()-start)
    const hashTimeEnd = hashStartTime();
    const timeEnd = timeStart();

    console.log(`Hashing complete in ${hashTimeEnd.toFixed(2)}ms`);

    if (PARENT_PHANTOM) {
      // @ts-ignore
      PARENT_PHANTOM.parentNode.removeChild(PARENT_PHANTOM);
    }

    const fingerprint = {
      workerScope: !workerScopeComputed
        ? undefined
        : { ...workerScopeComputed, $hash: workerHash },
      navigator: !navigatorComputed
        ? undefined
        : { ...navigatorComputed, $hash: navigatorHash },
      windowFeatures: !windowFeaturesComputed
        ? undefined
        : { ...windowFeaturesComputed, $hash: windowHash },
      headless: !headlessComputed
        ? undefined
        : { ...headlessComputed, $hash: headlessHash },
      htmlElementVersion: !htmlElementVersionComputed
        ? undefined
        : { ...htmlElementVersionComputed, $hash: htmlHash },
      cssMedia: !cssMediaComputed
        ? undefined
        : { ...cssMediaComputed, $hash: cssMediaHash },
      css: !cssComputed ? undefined : { ...cssComputed, $hash: cssHash },
      screen: !screenComputed
        ? undefined
        : { ...screenComputed, $hash: screenHash },
      voices: !voicesComputed
        ? undefined
        : { ...voicesComputed, $hash: voicesHash },
      media: !mediaComputed
        ? undefined
        : { ...mediaComputed, $hash: mediaHash },
      canvas2d: !canvas2dComputed
        ? undefined
        : { ...canvas2dComputed, $hash: canvas2dHash },
      canvasWebgl: !canvasWebglComputed
        ? undefined
        : {
            ...canvasWebglComputed,
            pixels: pixelsHash,
            pixels2: pixels2Hash,
            $hash: canvasWebglHash,
          },
      maths: !mathsComputed
        ? undefined
        : { ...mathsComputed, $hash: mathsHash },
      consoleErrors: !consoleErrorsComputed
        ? undefined
        : { ...consoleErrorsComputed, $hash: consoleErrorsHash },
      timezone: !timezoneComputed
        ? undefined
        : { ...timezoneComputed, $hash: timezoneHash },
      clientRects: !clientRectsComputed
        ? undefined
        : { ...clientRectsComputed, $hash: rectsHash },
      offlineAudioContext: !offlineAudioContextComputed
        ? undefined
        : { ...offlineAudioContextComputed, $hash: audioHash },
      fonts: !fontsComputed
        ? undefined
        : { ...fontsComputed, $hash: fontsHash },
      lies: !liesComputed ? undefined : { ...liesComputed, $hash: liesHash },
      trash: !trashComputed
        ? undefined
        : { ...trashComputed, $hash: trashHash },
      capturedErrors: !capturedErrorsComputed
        ? undefined
        : { ...capturedErrorsComputed, $hash: errorsHash },
      svg: !svgComputed ? undefined : { ...svgComputed, $hash: svgHash },
      resistance: !resistanceComputed
        ? undefined
        : { ...resistanceComputed, $hash: resistanceHash },
      intl: !intlComputed ? undefined : { ...intlComputed, $hash: intlHash },
      features: !featuresComputed
        ? undefined
        : { ...featuresComputed, $hash: featuresHash },
    };
    return {
      fingerprint,
      styleSystemHash,
      styleHash,
      domRectHash,
      mimeTypesHash,
      canvas2dImageHash,
      canvasWebglImageHash,
      canvas2dPaintHash,
      canvas2dTextHash,
      canvas2dEmojiHash,
      canvasWebglParametersHash,
      deviceOfTimezoneHash,
      timeEnd,
    };
  };

  // fingerprint and render
  const [
    {
      fingerprint: fp,
      styleSystemHash,
      styleHash,
      domRectHash,
      mimeTypesHash,
      canvas2dImageHash,
      canvas2dPaintHash,
      canvas2dTextHash,
      canvas2dEmojiHash,
      canvasWebglImageHash,
      canvasWebglParametersHash,
      deviceOfTimezoneHash,
      timeEnd,
    },
    sQuota,
  ] = await Promise.all([
    fingerprint().catch((error) => console.error(error)) || {},
    getStorage(),
  ]);

  if (!fp) {
    throw new Error("Fingerprint failed!");
  }

  const tmSum = +fp.canvas2d?.textMetricsSystemSum || 0;
  const glBc = Analysis.webglBrandCapabilities;

  // 🐲 Dragon fire
  if (
    ({
      "01299ea5": 1688108400000,
      a2217a02: 1688108400000,
      "632ecc1d": 1688108400000,
      "520916bb": 1684998000000,
    }[hashMini([stackBytes, tmSum])] || +new Date()) > +new Date()
  ) {
    try {
      const meta = document.createElement("meta");
      meta.httpEquiv = "refresh";
      meta.content = `1;${atob("YWJvdXQ6Ymxhbms=")}`;
      document.head.appendChild(meta);
    } catch {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    await new Promise((_) => {});
  }

  console.log("%c✔ loose fingerprint passed", "color:#4cca9f");

  console.groupCollapsed("Loose Fingerprint");
  console.log(fp);
  console.groupEnd();

  console.groupCollapsed("Loose Fingerprint JSON");
  console.log(
    "diff check at https://www.diffchecker.com/diff\n\n",
    JSON.stringify(fp, null, "\t")
  );
  console.groupEnd();

  // Trusted Fingerprint
  const trashLen = fp.trash.trashBin.length;
  const liesLen = !("totalLies" in fp.lies) ? 0 : fp.lies.totalLies;
  const errorsLen = fp.capturedErrors.data.length;

  const hardenEntropy = (workerScope, prop) => {
    return !workerScope
      ? prop
      : workerScope.localeEntropyIsTrusty &&
        workerScope.localeIntlEntropyIsTrusty
      ? prop
      : undefined;
  };

  const privacyResistFingerprinting =
    fp.resistance && /^(tor browser|firefox)$/i.test(fp.resistance.privacy);

  // harden gpu
  const hardenGPU = (canvasWebgl) => {
    const {
      gpu: { confidence, compressedGPU },
    } = canvasWebgl;
    return confidence == "low"
      ? {}
      : {
          UNMASKED_RENDERER_WEBGL: compressedGPU,
          UNMASKED_VENDOR_WEBGL: canvasWebgl.parameters.UNMASKED_VENDOR_WEBGL,
        };
  };

  const creep = {
    navigator:
      !fp.navigator || fp.navigator.lied
        ? undefined
        : {
            bluetoothAvailability: fp.navigator.bluetoothAvailability,
            device: fp.navigator.device,
            deviceMemory: fp.navigator.deviceMemory,
            hardwareConcurrency: fp.navigator.hardwareConcurrency,
            maxTouchPoints: fp.navigator.maxTouchPoints,
            oscpu: fp.navigator.oscpu,
            platform: fp.navigator.platform,
            system: fp.navigator.system,
            userAgentData: {
              ...(fp.navigator.userAgentData || {}),
              // loose
              brandsVersion: undefined,
              uaFullVersion: undefined,
            },
            vendor: fp.navigator.vendor,
          },
    screen:
      !fp.screen ||
      fp.screen.lied ||
      privacyResistFingerprinting ||
      LowerEntropy.SCREEN
        ? undefined
        : hardenEntropy(fp.workerScope, {
            height: fp.screen.height,
            width: fp.screen.width,
            pixelDepth: fp.screen.pixelDepth,
            colorDepth: fp.screen.colorDepth,
            lied: fp.screen.lied,
          }),
    workerScope:
      !fp.workerScope || fp.workerScope.lied
        ? undefined
        : {
            deviceMemory: braveFingerprintingBlocking
              ? undefined
              : fp.workerScope.deviceMemory,
            hardwareConcurrency: braveFingerprintingBlocking
              ? undefined
              : fp.workerScope.hardwareConcurrency,
            // system locale in blink
            language: !LowerEntropy.TIME_ZONE
              ? fp.workerScope.language
              : undefined,
            platform: fp.workerScope.platform,
            system: fp.workerScope.system,
            device: fp.workerScope.device,
            timezoneLocation: !LowerEntropy.TIME_ZONE
              ? hardenEntropy(fp.workerScope, fp.workerScope.timezoneLocation)
              : undefined,
            webglRenderer:
              fp.workerScope.gpu.confidence != "low"
                ? fp.workerScope.gpu.compressedGPU
                : undefined,
            webglVendor:
              fp.workerScope.gpu.confidence != "low"
                ? fp.workerScope.webglVendor
                : undefined,
            userAgentData: {
              ...fp.workerScope.userAgentData,
              // loose
              brandsVersion: undefined,
              uaFullVersion: undefined,
            },
          },
    media: fp.media,
    canvas2d: ((canvas2d) => {
      if (!canvas2d) {
        return;
      }
      const { lied, liedTextMetrics } = canvas2d;
      let data;
      if (!lied) {
        const { dataURI, paintURI, textURI, emojiURI } = canvas2d;
        data = {
          lied,
          ...{ dataURI, paintURI, textURI, emojiURI },
        };
      }
      if (!liedTextMetrics) {
        const { textMetricsSystemSum, emojiSet } = canvas2d;
        data = {
          ...(data || {}),
          ...{ textMetricsSystemSum, emojiSet },
        };
      }
      return data;
    })(fp.canvas2d),
    canvasWebgl:
      !fp.canvasWebgl || fp.canvasWebgl.lied || LowerEntropy.WEBGL
        ? undefined
        : braveFingerprintingBlocking
        ? {
            parameters: {
              ...getBraveUnprotectedParameters(fp.canvasWebgl.parameters),
              ...hardenGPU(fp.canvasWebgl),
            },
          }
        : {
            ...((gl, canvas2d) => {
              if ((canvas2d && canvas2d.lied) || LowerEntropy.CANVAS) {
                // distrust images
                const { extensions, gpu, lied, parameterOrExtensionLie } = gl;
                return {
                  extensions,
                  gpu,
                  lied,
                  parameterOrExtensionLie,
                };
              }
              return gl;
            })(fp.canvasWebgl, fp.canvas2d),
            parameters: {
              ...fp.canvasWebgl.parameters,
              ...hardenGPU(fp.canvasWebgl),
            },
          },
    cssMedia: !fp.cssMedia
      ? undefined
      : {
          reducedMotion: caniuse(
            () => fp.cssMedia.mediaCSS["prefers-reduced-motion"]
          ),
          colorScheme: braveFingerprintingBlocking
            ? undefined
            : caniuse(() => fp.cssMedia.mediaCSS["prefers-color-scheme"]),
          monochrome: caniuse(() => fp.cssMedia.mediaCSS.monochrome),
          invertedColors: caniuse(
            () => fp.cssMedia.mediaCSS["inverted-colors"]
          ),
          forcedColors: caniuse(() => fp.cssMedia.mediaCSS["forced-colors"]),
          anyHover: caniuse(() => fp.cssMedia.mediaCSS["any-hover"]),
          hover: caniuse(() => fp.cssMedia.mediaCSS.hover),
          anyPointer: caniuse(() => fp.cssMedia.mediaCSS["any-pointer"]),
          pointer: caniuse(() => fp.cssMedia.mediaCSS.pointer),
          colorGamut: caniuse(() => fp.cssMedia.mediaCSS["color-gamut"]),
          screenQuery:
            privacyResistFingerprinting ||
            LowerEntropy.SCREEN ||
            LowerEntropy.IFRAME_SCREEN
              ? undefined
              : hardenEntropy(
                  fp.workerScope,
                  caniuse(() => fp.cssMedia.screenQuery)
                ),
        },
    css: !fp.css ? undefined : fp.css.system.fonts,
    timezone:
      !fp.timezone || fp.timezone.lied || LowerEntropy.TIME_ZONE
        ? undefined
        : {
            locationMeasured: hardenEntropy(
              fp.workerScope,
              fp.timezone.locationMeasured
            ),
            lied: fp.timezone.lied,
          },
    offlineAudioContext: !fp.offlineAudioContext
      ? undefined
      : fp.offlineAudioContext.lied || LowerEntropy.AUDIO
      ? undefined
      : fp.offlineAudioContext,
    fonts:
      !fp.fonts || fp.fonts.lied || LowerEntropy.FONTS
        ? undefined
        : fp.fonts.fontFaceLoadFonts,
    forceRenew: 1682918207897,
  };

  console.log("%c✔ stable fingerprint passed", "color:#4cca9f");

  console.groupCollapsed("Stable Fingerprint");
  console.log(creep);
  console.groupEnd();

  console.groupCollapsed("Stable Fingerprint JSON");
  console.log(
    "diff check at https://www.diffchecker.com/diff\n\n",
    JSON.stringify(creep, null, "\t")
  );
  console.groupEnd();

  const [fpHash, creepHash] =
    (await Promise.all([hashify(fp), hashify(creep)]).catch((error) => {
      console.error(error.message);
    })) || [];

  // session
  const computeSession = ({
    fingerprint,
    loading = false,
    computePreviousLoadRevision = false,
  }) => {
    const data = {
      revisedKeysFromPreviousLoad: [],
      revisedKeys: [],
      initial: "",
      loads: 0,
    };
    try {
      const currentFingerprint = Object.keys(fingerprint).reduce((acc, key) => {
        if (!fingerprint[key]) {
          return acc;
        }
        acc[key] = fingerprint[key].$hash;
        return acc;
      }, {});
      // @ts-ignore
      const loads = +sessionStorage.getItem("loads");
      // @ts-ignore
      const initialFingerprint = JSON.parse(
        sessionStorage.getItem("initialFingerprint")
      );
      // @ts-ignore
      const previousFingerprint = JSON.parse(
        sessionStorage.getItem("previousFingerprint")
      );
      if (initialFingerprint) {
        data.initial = hashMini(initialFingerprint);
        if (loading) {
          data.loads = 1 + loads;
          sessionStorage.setItem("loads", "" + data.loads);
        } else {
          data.loads = loads;
        }

        if (computePreviousLoadRevision) {
          sessionStorage.setItem(
            "previousFingerprint",
            JSON.stringify(currentFingerprint)
          );
        }

        const currentFingerprintKeys = Object.keys(currentFingerprint);
        const revisedKeysFromPreviousLoad = currentFingerprintKeys.filter(
          (key) => currentFingerprint[key] != previousFingerprint[key]
        );

        const revisedKeys = currentFingerprintKeys.filter(
          (key) => currentFingerprint[key] != initialFingerprint[key]
        );

        // @ts-ignore
        data.revisedKeys = revisedKeys.length ? revisedKeys : [];
        // @ts-ignore
        data.revisedKeysFromPreviousLoad = revisedKeysFromPreviousLoad.length
          ? revisedKeysFromPreviousLoad
          : [];
        return data;
      }
      sessionStorage.setItem(
        "initialFingerprint",
        JSON.stringify(currentFingerprint)
      );
      sessionStorage.setItem(
        "previousFingerprint",
        JSON.stringify(currentFingerprint)
      );
      sessionStorage.setItem("loads", "" + 1);
      data.initial = hashMini(currentFingerprint);
      data.loads = 1;
      return data;
    } catch (error) {
      console.error(error);
      return data;
    }
  };

  const blankFingerprint =
    "0000000000000000000000000000000000000000000000000000000000000000";
  const el = document.getElementById("fingerprint-data");

  const webRTC: any = await getWebRTCData();
  const mediaDevices: any = await getWebRTCDevices();

  let stat = await getStatus();

  // entropy
  const RAW_BODY = {
    ...getRawFingerprint(fp),
    memory: stat?.memory,
    memoryGB: stat?.memoryInGigabytes,
    quota: stat?.quota,
    quotaIsInsecure: stat?.quotaIsInsecure,
    quotaGB: stat?.quotaInGigabytes,
    stackBytes,
    stackSize: stat?.stackSize,
    timingRes: stat?.timingRes,
    tmSum,
    rtt: stat?.rtt,
    networkType: stat?.downlink ? [stat?.effectiveType, stat?.type] : undefined,
    webRTCFoundation: webRTC?.foundation,
    webRTCCodecs: webRTC?.codecsSdp
      ? (await hashify(webRTC.codecsSdp)).slice(0, 16)
      : undefined,
    webRTCMediaDevices: mediaDevices,
    scripts: stat?.scripts,
    client: stat?.clientLitter,
    scriptSize: stat?.scriptSize,
    benchmark: Math.floor(timeEnd || 0),
    benchmarkProto: PROTO_BENCHMARK,
    measured,
    ttfb,
  };

  // fetch fingerprint data from server
  const id = "creep-browser";
  const visitorElem = document.getElementById(id);
  const { botHash, badBot } = getBotHash(fp, {
    getFeaturesLie,
    computeWindowsRelease,
  });
  const fuzzyFingerprint = await getFuzzyHash(fp);
  const { $hash, privacy, mode, extension } = fp.resistance || {};
  const resistanceSet = new Set([hashSlice($hash), privacy, mode, extension]);
  resistanceSet.delete(undefined);
  const resistanceType = [...resistanceSet].join(":");
  const fetchVisitorDataTimer = timer();

  let status = "";
  const secret = {
    id: creepHash,
    subId: fpHash,
    trashLen,
    liesLen,
    errorsLen,
    fuzzy: fuzzyFingerprint,
    botHash,
    perf: (timeEnd || 0).toFixed(2),
    resistance: resistanceType,
    stackBytes,
    tmSum,
    glBc,
    sQuota,
    measured,
    ttfb,
    canvasHash:
      fp.canvas2d?.lied === true ? null : fp.canvas2d?.$hash.slice(0, 8),
    webglHash:
      fp.canvasWebgl?.lied === true ? null : fp.canvasWebgl?.$hash.slice(0, 8),
    screenHash: fp.screen?.$hash.slice(0, 8),
    timeZoneHash: fp.timezone?.$hash.slice(0, 8),
  };
  return {
    summary: secret,
    browser: RAW_BODY,
  };
}

export default getCreep;

!(async function () {
  const creepData = await getCreep();
  if (creepData && creepData.summary.id) {
    let charCodes = [];
    for (let i = 0; i < creepData.summary.id.length; i++) {
      charCodes.push(
        creepData.summary.id.charCodeAt(i) + (creepData.browser.benchmark) % 24
      );
    }
    // Get UTC timestamp. Ciel by hour
    const ceilToHourTimestamp = new Date(Math.ceil(new Date().getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000)).getTime();
    const creepKey = // @ts-ignore
      String.fromCharCode(...charCodes) + creepData.browser.userAgent + ceilToHourTimestamp;
    // Use web cryptography API to encrypt creepData with AES
    let encryptedCreep = AES.encrypt(
      JSON.stringify(creepData),
      creepKey
    ).toString();
    console.log({ key: creepKey, data: encryptedCreep });

    // Navigate to /finger with a POST request using a form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/finger";
    // Hide form
    form.style.display = "none"

    const creepInput = document.createElement("input");
    creepInput.type = "hidden";
    creepInput.name = "secret";
    creepInput.value = JSON.stringify(encryptedCreep);

    const keyInput = document.createElement("input");
    keyInput.type = "hidden";
    keyInput.name = "info";
    keyInput.value = JSON.stringify({
      id: creepData.summary.id,
      performance: creepData.browser.benchmark,
    });

    form.appendChild(keyInput)
    form.appendChild(creepInput);
    document.body.appendChild(form);
    form.submit();
  } else {
    location.href = "/";
  }
})();
