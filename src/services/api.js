const BASE_URL = "http://localhost/finance-tracker-web-app/backend";
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};