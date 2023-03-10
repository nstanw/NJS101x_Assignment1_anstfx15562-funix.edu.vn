class Cookie {
  tokenCookieName = "cookie.AuthToken";

  setCookieValue(key: string, value: string, expireDate: Date, path: string, domain?: string): void {
    var cookieValue = encodeURIComponent(key) + "=";
    if (value) {
      cookieValue = cookieValue + encodeURIComponent(value);
    }

    if (expireDate) {
      cookieValue = cookieValue + "; expires=" + expireDate.toUTCString();
    }

    if (path) {
      cookieValue = cookieValue + "; path=" + path;
    }

    if (domain) {
      cookieValue = cookieValue + "; domain=" + domain;
    }

    document.cookie = cookieValue;
    console.log(document.cookie);
  }

  getCookieValue = function (key: string) {
    var equalities = document.cookie.split("; ");
    for (var i = 0; i < equalities.length; i++) {
      if (!equalities[i]) {
        continue;
      }

      var splitted = equalities[i].split("=");
      if (splitted.length != 2) {
        continue;
      }

      if (decodeURIComponent(splitted[0]) === key) {
        return decodeURIComponent(splitted[1] || "");
      }
    }

    return null;
  };

  deleteCookie = function (key : string, path?:string) {
    var cookieValue = encodeURIComponent(key) + '=';

    cookieValue = cookieValue + "; expires=" + (new Date(new Date().getTime() - 86400000)).toUTCString();

    if (path) {
        cookieValue = cookieValue + "; path=" + path;
    }

    document.cookie = cookieValue;
}
 checkCookie(key: string) {
    let user = this.getCookieValue(key);
    if (user != "") {
      return user;
    } 
    return null;
  }

}
export default new Cookie;
