import printer from "printer";

export function imprimirTicket(venta: any, detalles: any[]) {

    const printerName = "POS-58"; // EXACTO como en Windows

    let content = "";

    content += "TIENDA JAZMIN\n";
    content += "Jardin America\n";
    content += "----------------------\n";
    content += `Fecha: ${new Date(venta.fecha).toLocaleString("es-AR")}\n`;
    content += `Pago: ${venta.metodo_pago}\n`;
    content += "----------------------\n";

    detalles.forEach(item => {
        content += `${item.producto_nombre}\n`;
        content += `${item.cantidad} x $${item.precio_unitario}\n`;
        content += `Subtotal: $${item.subtotal}\n\n`;
    });

    content += "----------------------\n";
    content += `TOTAL: $${venta.total}\n`;
    content += "\n\n\n";

    printer.printDirect({
        data: content,
        printer: printerName,
        type: "RAW",
        success: function () {
            console.log("Ticket impreso");
        },
        error: function (err) {
            console.error("Error impresión:", err);
        }
    });
}