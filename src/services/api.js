const BASE_URL = "http://xenofin.gt.tc"; 

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Response check karein
    if (!res.ok) {
      throw new Error("Server error!");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: "Connection failed" };
  }
};
