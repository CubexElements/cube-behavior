import {dedupingMixin} from "@polymer/polymer/lib/utils/mixin.js";

/** @polymerBehavior */
export const CubeServiceBehavior = dedupingMixin(superClass => {
  class CubeServiceBehavior extends superClass {
    getServiceHost(subDomain, port, tld)
    {
      if(subDomain === "apps")
      {
        return window.location.host;
      }
      port = port || window.location.port;
      let host = window.location.hostname.replace(/^.+?\./, '');
      if(tld)
      {
        host = host.split('.', 2)[0] + "." + tld;
      }

      if(subDomain === "cdn")
      {
        subDomain = "storage.googleapis.com/" + subDomain
      }

      return (subDomain ? subDomain + '.' : '')
        + host
        + (port ? ':' + port : '');
    }
  }

  return CubeServiceBehavior;
});