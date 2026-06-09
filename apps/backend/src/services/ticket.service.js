import prisma from "../db/db.js";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { ApiError } from "../utils/ApiError.js";

class TicketService {
  static async getAllTickets() {
    const tickets = await prisma.ticket.findMany({
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            totalAmount: true,
            slotDateTime: true,

            place: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        },

        type: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return tickets;
  }
  static async generatePDF(bookingId) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        place: true,

        tickets: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    const pdfPromise = new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // 🔥 LOOP ALL TICKETS
    for (const [index, ticket] of booking.tickets.entries()) {
      // HEADER
      doc.fontSize(24).text("Ticket Booking", {
        align: "center",
      });

      doc.moveDown();

      // BOOKING DETAILS
      doc.fontSize(16).text(`Booking ID: ${booking.id}`);

      doc.text(`Customer: ${booking.name}`);

      doc.text(`Email: ${booking.email}`);

      doc.text(`Phone: ${booking.phone}`);

      doc.text(`Place: ${booking.place.name}`);

      doc.text(
        `Slot: ${new Date(booking.slotDateTime).toLocaleString("en-IN")}`
      );

      doc.text(`Status: ${booking.status}`);

      doc.text(`Total Amount: Rs${booking.totalAmount}`);

      doc.moveDown();

      // TICKET DETAILS
      doc.fontSize(18).text(`Ticket ${index + 1}`, {
        underline: true,
      });

      doc.moveDown();

      doc.fontSize(14).text(`Ticket ID: ${ticket.id}`);

      doc.text(`Type: ${ticket.type.name}`);

      doc.text(`Ticket Status: ${ticket.status}`);

      doc.moveDown();

      // 🔥 GENERATE QR IMAGE
      const qrImage = await QRCode.toDataURL(ticket.qrCode);

      // 🔥 SHOW QR IMAGE
      doc.image(qrImage, {
        fit: [180, 180],
        align: "center",
      });

      doc.moveDown(4);

      // 🔥 NEXT PAGE
      if (index !== booking.tickets.length - 1) {
        doc.addPage();
      }
    }

    doc.end();

    return pdfPromise;
  }
  static async scanTicket(payload) {

  const { qrCode } = payload;

  const ticket = await prisma.ticket.findFirst({
    where: {
      qrCode,
    },

    include: {
      booking: true,
      type: true,
      place: true,
      user: true,
    },
  });

  if (!ticket) {
    throw ApiError.notFound("Invalid Ticket");
  }

  // already scanned
  if (ticket.status === "SCANNED") {
    throw ApiError.badRequest("Ticket already scanned");
  }

  // booking unpaid
  if (ticket.booking.status !== "PAID") {
    throw ApiError.badRequest("Payment not completed");
  }

  // update status
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticket.id,
    },

    data: {
      status: "SCANNED",
    },
  });

  // save logs
  await prisma.scanLog.create({
  data: {
    ticketId: ticket.id,
    type: "ENTRY",
  },
});

  return {
    ticket: updatedTicket,
    booking: ticket.booking,
    type: ticket.type,
  };
}
}

export default TicketService;
