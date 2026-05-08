export async function snapTool(params: any) {
  const { origin, destination } = params;

  // اینجا بعداً Playwright یا API واقعی میاد
  return {
    status: "ok",
    message: `درخواست اسنپ از ${origin} به ${destination} ثبت شد`,
  };
}