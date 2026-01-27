import NoAtClass from "./no-at-class.mjs";
import NoImplicitThis from "./no-implicit-this.mjs";
import PluginOutletLazyHash from "./plugin-outlet-lazy-hash.mjs";

export default {
  // Name of plugin
  name: "discourse",

  // Define rules for this plugin. Each path should map to a plugin rule
  rules: {
    "discourse/no-at-class": NoAtClass,
    "discourse/no-implicit-this": NoImplicitThis,
    "discourse/plugin-outlet-lazy-hash": PluginOutletLazyHash,
  },
};
