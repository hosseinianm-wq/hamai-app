export async function ticketTool(params: any) {
  return {
    status: "ok",
    message: `جستجوی بلیط برای ${params.from} به ${params.to}`,
  };
}