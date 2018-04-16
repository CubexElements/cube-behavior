import "@polymer/iron-ajax/iron-ajax.js";
import {CubeIteratorBehavior} from "./cube-iterator-behavior.js";

import IntlMessageFormat from "intl-messageformat/src/main.js";
import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin";

/** @polymerBehavior */
export const CubeI18nBehavior = dedupingMixin(superClass => {
  class CubeI18nBehavior extends CubeIteratorBehavior(superClass) {
    static get properties()
    {
      return {
        languages: {
          type:  Array,
          value: function () {return Array.prototype.slice.call(navigator.languages)}
        },
        /**
         * The dictionary of localized messages, for each of the languages that
         * are going to be used. See http://formatjs.io/guides/message-syntax/ for
         * more information on the message syntax.
         *
         * For example, a valid dictionary would be:
         * this.resources = {
         *  'en': { 'greeting': 'Hello!' }, 'fr' : { 'greeting': 'Bonjour!' }
         * }
         */
        resources: {
          type: Object
        },

        /**
         * The path to the dictionary of localized messages. The format is the
         * same as the `resources` array, only saved as an external json file.
         * Note that using a path will populate the `resources` property, and override
         * the previous data.
         */
        pathToResources: {
          type: String
        },

        /**
         * Optional dictionary of user defined formats, as explained here:
         * http://formatjs.io/guides/message-syntax/#custom-formats
         *
         * For example, a valid dictionary of formats would be:
         * this.formats = {
         *    number: { USD: { style: 'currency', currency: 'USD' } }
         * }
         */
        formats: {
          type:  Object,
          value: function () { return {} }
        },

        /**
         * Translates a string to the current `language`. Any parameters to the
         * string should be passed in order, as follows:
         * `i18n(stringKey, param1Name, param1Value, param2Name, param2Value)`
         */
        i18n: {
          type:     Function,
          computed: '__computeI18n(languages, resources, formats)'
        },

        /**
         * Translates a string to the current `language`. Any parameters to the
         * string should be passed in order, as follows:
         * `i18nResource(resources, param1Name, param1Value, param2Name, param2Value)`
         */
        i18nResource: {
          type:     Function,
          computed: '__computeI18nResource(languages, formats)'
        },

        /**
         * Translates a string to the current `language`. Any parameters to the
         * string should be passed in an object, as follows:
         * `i18n(stringKey, keyValue)`
         */
        i18nData: {
          type:     Function,
          computed: '__computeI18nData(i18n)'
        },

        /**
         * Translates a string to the current `language`. Any parameters to the
         * string should be passed in an object, as follows:
         * `i18n(resources, keyValue)`
         */
        i18nResourceData: {
          type:     Function,
          computed: '__computeI18nData(i18nResource)'
        },

        __localizationCache: {
          type:  Object,
          value: {
            requests: {}, /* One iron-request per unique resources path. */
            messages: {}, /* Unique localized strings. Invalidated when the language, formats or resources change. */
            ajax:     null     /* Global iron-ajax object used to request resource files. */
          }
        }
      }
    }

    loadResources(path)
    {
      // If the global ajax object has not been initialized, initialize and cache it.
      let ajax = this.__localizationCache.ajax;
      if(!ajax)
      {
        //noinspection JSValidateTypes
        ajax = this.__localizationCache.ajax = document.createElement('iron-ajax');
      }

      let request = this.__localizationCache.requests[path];
      if(!request)
      {
        ajax.url = path;
        request = ajax.generateRequest();

        request.completes.then(
          this.__onRequestResponse.bind(this),
          this.__onRequestError.bind(this)
        );

        // Cache the instance so that it can be reused if the same path is loaded.
        this.__localizationCache.requests[path] = request;
      }
      else
      {
        request.completes.then(
          this.__onRequestResponse.bind(this),
          this.__onRequestError.bind(this)
        );
      }
    }

    __getTranslation(passedArguments, resources, languages, formats, cache)
    {
      let
        self = this,
        keys = passedArguments[0];

      if(!keys || !resources || !languages)
      {
        return;
      }

      if(languages.indexOf('en') === -1)
      {
        languages.push('en');
      }

      keys = typeof keys === 'string' ? [keys] : keys;
      let keyResult = self.iterate(
        keys, function (key) {
          let result = self.iterate(
            languages, function (lang) {
              if(resources.hasOwnProperty(lang))
              {
                let inKeys = resources[lang];
                if(inKeys.hasOwnProperty(key))
                {
                  return {text: inKeys[key], language: lang};
                }
              }
            }
          );
          if(result !== undefined)
          {
            return [key, result];
          }
        }
      );

      let key, result = null;

      if(keyResult !== undefined)
      {
        key = keyResult[0];
        result = keyResult[1];
      }
      else
      {
        key = keys.shift();
      }

      if(result === null)
      {
        console.debug(key + " is not currently supported in your element");
        return key;
      }

      // Cache the key/value pairs for the same language, so that we don't
      // do extra work if we're just reusing strings across an application.
      let messageKey = key + result.text, msg;
      if(cache)
      {
        msg = cache.messages[messageKey];
      }

      if(!msg)
      {
        msg = new IntlMessageFormat(result.text, result.language, formats);
        if(cache)
        {
          cache.messages[messageKey] = msg;
        }
      }

      let args = {};
      for(let i = 1; i < passedArguments.length; i += 2)
      {
        args[passedArguments[i]] = passedArguments[i + 1];
      }
      return msg.format(args);
    }

    /**
     * Returns a computed `i18n` method, based on the browser languages.
     */
    __computeI18n(languages, resources, formats)
    {
      let
        self = this;
      // Everytime any of the parameters change, invalidate the strings cache.

      this.__localizationCache.messages = {};

      return function () {
        return self.__getTranslation(
          arguments, resources, languages, formats, this.__localizationCache
        )
      };
    }

    __computeI18nResource(languages, formats)
    {
      let self = this;
      return function () {
        let args = [];
        for(let i in arguments)
        {
          if(arguments.hasOwnProperty(i))
          {
            args.push(arguments[i]);
          }
        }
        let resources = args.shift();
        args.unshift('_cube_res_key_');

        let newResources = {};
        for(let i in resources)
        {
          if(resources.hasOwnProperty(i))
          {
            newResources[i] = {};
            newResources[i]['_cube_res_key_'] = resources[i];
          }
        }
        return self.__getTranslation(args, newResources, languages, formats);
      };
    }

    __computeI18nData(i18n)
    {
      return function () {
        if(!i18n)
        {
          return;
        }

        let stringKey = arguments[0];
        let args = [];
        for(let i in arguments[1])
        {
          if(arguments[1].hasOwnProperty(i))
          {
            args.push(i);
            args.push(arguments[1][i]);
          }
        }
        args.unshift(stringKey);
        return i18n.apply(this, args);
      }
    }

    __onRequestResponse(event)
    {
      this.resources = event.response;
      this.dispatchEvent(new CustomEvent('cube-i18n-resources-loaded'));
    }

    __onRequestError(event)
    {
      this.dispatchEvent(new CustomEvent('cube-i18n-resources-error'));
    }

    hydrateResources(data, clear)
    {
      let
        self = this,
        resources = clear ? {} : self.resources;
      if(data === Object(data))
      {
        self.iterate(
          data, function (translations, key) {
            if(translations !== Object(translations))
            {
              translations = {'en': translations};
            }
            self.iterate(
              translations, function (translation, language) {
                resources[language] = resources[language] || {};
                resources[language][key] = translation;
              }
            );
          }
        );
      }
      if(Object.keys(resources).length === 0)
      {
        resources = undefined;
      }
      this.resources = resources;
    }
  }

  return CubeI18nBehavior;
});