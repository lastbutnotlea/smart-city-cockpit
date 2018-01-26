import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from "@angular/router";
import {Injectable} from "@angular/core";

/**
 * Disallow re-use of components
 */
@Injectable()
export class CharliesRouterReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
