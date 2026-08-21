from typing import Dict, Any

class ResponseCopilotAgent:
    """
    Response Copilot Engine.
    Generates bureaucratic-compliant, empathetic, and actionable official drafts for public responses.
    """

    def generate_draft(
        self,
        reporter_name: str,
        category: str,
        urgency: str,
        opd_name: str,
        masked_text: str
    ) -> Dict[str, Any]:
        short_summary = masked_text[:120] + "..." if len(masked_text) > 120 else masked_text

        if urgency == "CRITICAL":
            title = f"Tanggapan Tanggap Darurat — {category}"
            body = (
                f"Yth. {reporter_name}, terima kasih atas laporan mendesak Anda. Laporan terkait: \"{short_summary}\" "
                f"telah kami tetapkan berstatus TANGGAP DARURAT (CRITICAL). Disposisi segera diteruskan kepada Tim Reaksi Cepat "
                f"{opd_name} untuk penanganan langsung di lokasi dalam prioritas utama. Mohon warga di sekitar lokasi tetap berhati-hati."
            )
            tone = "Empathetic Urgent"
        elif urgency == "HIGH":
            title = f"Tanggapan Cepat — {category}"
            body = (
                f"Yth. {reporter_name}, terima kasih atas kepedulian Anda terhadap fasilitas publik. Laporan Anda mengenai \"{short_summary}\" "
                f"telah kami terima dan didisposisikan ke {opd_name}. Tim teknis terkait telah dijadwalkan untuk melakukan survei dan perbaikan teknis hari ini."
            )
            tone = "Empathetic Urgent"
        else:
            title = f"Tindak Lanjut Laporan — {category}"
            body = (
                f"Yth. {reporter_name}, terima kasih telah menyampaikan pengaduan melalui kanal resmi. Laporan Anda terkait \"{short_summary}\" "
                f"telah diverifikasi dan diteruskan kepada {opd_name} untuk ditindaklanjuti sesuai Standar Operasional Prosedur (SOP) pelayanan publik."
            )
            tone = "Formal Official"

        return {
            "draft_title": title,
            "draft_body": body,
            "tone": tone
        }
