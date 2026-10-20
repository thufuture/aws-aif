(() => {
  const form = document.getElementById("auth-form");
  const gate = document.getElementById("login-gate");
  const error = document.getElementById("auth-error");
  const submit = document.getElementById("auth-submit");
  const usernameInput = document.getElementById("auth-username");
  const passwordInput = document.getElementById("auth-password");

  const USERNAME = "venzotat";
  const SALT = "sXoX3Ja66qAuQp7y+WxN8g==";
  const PASSWORD_HASH = "c9a85e00d7cae67295c1bdc2acc44883da7884b2b6b3d108a4b442c4e16f6bb8";
  const SESSION_KEY = "aif_login_session";

  function unlock() {
    document.body.classList.remove("auth-locked");
    gate.hidden = true;
  }

  if (sessionStorage.getItem(SESSION_KEY) === "active") unlock();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    submit.disabled = true;
    submit.firstChild.textContent = "Đang kiểm tra… ";

    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", encoder.encode(passwordInput.value), "PBKDF2", false, ["deriveBits"]);
      const derived = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        salt: Uint8Array.from(atob(SALT), (character) => character.charCodeAt(0)),
        iterations: 310000,
        hash: "SHA-256"
      }, key, 256);
      const passwordHash = Array.from(new Uint8Array(derived), (byte) => byte.toString(16).padStart(2, "0")).join("");
      const valid = usernameInput.value.trim() === USERNAME && passwordHash === PASSWORD_HASH;

      if (!valid) {
        error.textContent = "Tên đăng nhập hoặc mật khẩu chưa đúng.";
        passwordInput.value = "";
        passwordInput.focus();
        return;
      }

      sessionStorage.setItem(SESSION_KEY, "active");
      unlock();
    } catch {
      error.textContent = "Không thể xác thực trên trình duyệt này. Hãy thử trình duyệt khác.";
    } finally {
      submit.disabled = false;
      submit.firstChild.textContent = "Đăng nhập ";
    }
  });
})();
