import { obtenerHistoriaClinicaCompletaPorId } from "@/db/historia_clinica_service";
import { obtenerItemsPorHistoriaId } from "@/db/linea_tiempo_item_service";
import { obtenerParientesPorHistoria } from "@/db/pariente_service";
import { HistoriaClinicaComunModel, HistoriaClinicaComunResult } from "@/models/historia_clinica_model";
import { ItemListaResult, ItemModel, ItemResult } from "@/models/lt_item_model";
import { ParienteListaResult, ParienteModel, ParienteResultRoles, ParientesListasRolesModel } from "@/models/pariente_model";
import { HistoriaCompleta, HistoriaCompletaResponse } from "./pdf_models";

// imports para expo-print

import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const generarPDF_old = async () => {
  try {
    const html = `
      <h1>Título h1</h1>
      <p>Aca va el texto</p>
    `;

    // 🕒 timestamp único
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `Prueba_de_pdfs_expo_${timestamp}.pdf`;

    const documentsDir = Paths.document;
    const file = new File(documentsDir, fileName);

    // 🧹 Si existe, borrarlo antes de mover
    if (file.exists) {
      file.delete();
    }

    // 🧾 Generar PDF temporal
    const { uri } = await Print.printToFileAsync({ html, base64: false });

    // 📦 Mover archivo generado a Documentos
    const tempFile = new File(uri);

    try {
      tempFile.move(file);
    } catch (err) {
      console.warn("⚠️ Error moviendo archivo, quizás ya existe:", err);
    }

    Alert.alert("PDF generado correctamente", "¿Qué querés hacer con el archivo?", [
      {
        text: "Enviar online",
        onPress: async () => {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(file.uri, {
              mimeType: "application/pdf",
              dialogTitle: "Compartir PDF",
              UTI: "com.adobe.pdf",
            });
          } else {
            Alert.alert("No disponible", "El uso compartido no está disponible en este dispositivo.");
          }
        },
      },
      {
        text: "Guardar localmente",
        onPress: () => {
          try {
            // ✅ Ya está guardado en Documentos
            Alert.alert("Guardado", `El archivo fue guardado en Documentos:\n${file.uri}`);
          } catch (error) {
            console.error("Error al guardar localmente:", error);
            Alert.alert("Error", "No se pudo guardar el archivo localmente.");
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);

    console.log("📄 PDF generado en:", file.uri);
  } catch (error) {
    console.error("❌ Error generando el PDF:", error);
  }
};


export const generarPDF = async (id: number) => {
  try {

    const file = await Print.printToFileAsync({
      html: await generarHtml(id),
      base64: false,
    })

    await Sharing.shareAsync(file.uri, {
      dialogTitle: "Compartir PDF",
    })

  } catch (error) {
    alert("Algo salió mal. Por favor revisa tu conexión a internet.")
  }
}


const generarHtml = async (id: number) => {
  const { success, data } = await obtenerDatos(id);

  if (!success || !data) {
    throw new Error("Error al obtener los datos de la historia clínica");
  }

  const historia = data;

  const safe = (value: any) => {
    if (value === null || value === undefined || value === "") return "-"
    return value
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Historia Clínica de ${safe(historia.nombre)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 30px;
          color: #333;
          line-height: 1.6;
        }
        h1, h2 {
          color: #005a8d;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        td, th {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        .section {
          margin-bottom: 30px;
        }
        .subtitulo {
          background: #f0f0f0;
          padding: 6px 10px;
          border-left: 4px solid #005a8d;
          margin-bottom: 10px;
        }
        ul {
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <h1>Historia Clínica</h1>
      <p><strong>Fecha de creación:</strong> ${safe(historia.fecha_creacion)}</p>

      <div class="section">
        <h2>Datos Personales</h2>
        <table>
          <tr><th>Nombre</th><td>${safe(historia.nombre)}</td></tr>
          <tr><th>DNI</th><td>${safe(historia.dni)}</td></tr>
          <tr><th>Edad</th><td>${safe(historia.edad)}</td></tr>
          <tr><th>Sexo</th><td>${safe(historia.sexo)}</td></tr>
          <tr><th>Estado civil</th><td>${safe(historia.estado_civil)}</td></tr>
          <tr><th>Lugar de nacimiento</th><td>${safe(historia.l_nacimiento)}</td></tr>
          <tr><th>Lugar de residencia</th><td>${safe(historia.l_residencia)}</td></tr>
          <tr><th>Ocupación</th><td>${safe(historia.ocupacion)}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Motivo de consulta</h2>
        <p>${safe(historia.motivo_consulta)}</p>

        <h2>Narración</h2>
        <p>${safe(historia.narracion)}</p>
      </div>

      <div class="section">
        <h2>Antecedentes</h2>
        <p><strong>Enfermedad:</strong> ${safe(historia.antecedentes_enfermedad)}</p>
        <p><strong>Alergias:</strong> ${safe(historia.alergias)}</p>
        <p><strong>Fisiológicos:</strong> ${safe(historia.antecedentes_fisiologicos)}</p>
        <p><strong>Patológicos:</strong> ${safe(historia.antecedentes_patologicos)}</p>
        <p><strong>Quirúrgicos:</strong> ${safe(historia.antecedentes_quirurgicos)}</p>
        <p><strong>Farmacológicos:</strong> ${safe(historia.antecedentes_farmacologicos)}</p>
      </div>

      <div class="section">
        <h2>Familiares</h2>
        <div class="subtitulo">Padre</div>
        <p><strong>Vive:</strong> ${historia.padre_vive ? "Sí" : "No"}</p>
        <p><strong>Enfermedad:</strong> ${safe(historia.padre_enfermedad)}</p>
        <p><strong>Causa de fallecimiento:</strong> ${safe(historia.padre_causa_fallecimiento)}</p>

        <div class="subtitulo">Madre</div>
        <p><strong>Vive:</strong> ${historia.madre_vive ? "Sí" : "No"}</p>
        <p><strong>Enfermedad:</strong> ${safe(historia.madre_enfermedad)}</p>
        <p><strong>Causa de fallecimiento:</strong> ${safe(historia.madre_causa_fallecimiento)}</p>
      </div>

      <div class="section">
        <h2>Hermanos</h2>
        ${
          historia.hermanos?.length
            ? `<ul>${historia.hermanos
                .map((h, i) => `<li><b>Hermano ${i + 1}:</b> ${safe(h.nota)}</li>`)
                .join("")}</ul>`
            : "<p>No hay hermanos registrados</p>"
        }

        <h2>Hijos</h2>
        ${
          historia.hijos?.length
            ? `<ul>${historia.hijos
                .map((h, i) => `<li><b>Hijo ${i + 1}:</b> ${safe(h.nota)}</li>`)
                .join("")}</ul>`
            : "<p>No hay hijos registrados</p>"
        }
      </div>

      <div class="section">
        <h2>Hábitos</h2>
        <p><strong>Alimentación:</strong> ${safe(historia.h_alimentacion)}</p>
        <p><strong>Diuresis:</strong> ${safe(historia.h_diuresis)}</p>
        <p><strong>Catarsis:</strong> ${safe(historia.h_catarsis)}</p>
        <p><strong>Sueño:</strong> ${safe(historia.h_sueño)}</p>
        <p><strong>Alcohol / Tabaco:</strong> ${safe(historia.h_alcohol_tabaco)}</p>
        <p><strong>Infusiones:</strong> ${safe(historia.h_infusiones)}</p>
        <p><strong>Fármacos:</strong> ${safe(historia.h_farmacos)}</p>
      </div>

      <div class="section">
        <h2>Condiciones de Vivienda</h2>
        <table>
          <tr><th>Obra social</th><td>${safe(historia.obra_social)}</td></tr>
          <tr><th>Material de la casa</th><td>${safe(historia.material_casa)}</td></tr>
          <tr><th>Electricidad</th><td>${historia.electricidad ? "Sí" : "No"}</td></tr>
          <tr><th>Agua</th><td>${historia.agua ? "Sí" : "No"}</td></tr>
          <tr><th>Toilet privado</th><td>${historia.toilet_privado ? "Sí" : "No"}</td></tr>
          <tr><th>Calefacción</th><td>${safe(historia.calefaccion)}</td></tr>
          <tr><th>Mascotas</th><td>${safe(historia.mascotas)}</td></tr>
          <tr><th>Otro</th><td>${safe(historia.otro)}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Línea de tiempo</h2>
        ${
          historia.linea_tiempo?.length
            ? `<ul>${historia.linea_tiempo
                .map(i => `<li><strong>${safe(i.fecha)}</strong> — ${safe(i.descripcion)}</li>`)
                .join("")}</ul>`
            : "<p>No hay eventos registrados</p>"
        }
      </div>
    </body>
    </html>
  `

  return html;
};


const obtenerHistoria = async (id: number): Promise<HistoriaClinicaComunResult> => {
  const response: HistoriaClinicaComunResult = await obtenerHistoriaClinicaCompletaPorId(id);

  if (!response.success) {
    throw new Error("create: Error obteniendo historia clínica ❌");
  }

  return response;
};

const obtenerParientes = async (id: number): Promise<ParienteResultRoles> => {
  try {
    const response: ParienteListaResult = await obtenerParientesPorHistoria(id);

    if (!response.success) {
      throw new Error("create: Error obteniendo parientes ❌");
    }

    const parientes: ParienteModel[] = (response.data as ParienteModel[]) || [];
    const hijos = parientes.filter(p => p.tipo === "hijo");
    const hermanos = parientes.filter(p => p.tipo === "hermano");

    const data: ParientesListasRolesModel = {
      hijos,
      hermanos,
    };

    return { success: true, data };
  } catch (error) {
    return { success: false };
  }
};

const obtenerItems = async (id: number): Promise<ItemResult> => {
  try {
    const response: ItemListaResult = await obtenerItemsPorHistoriaId(id);

    if (!response.success) {
      throw new Error("create: Error obteniendo items ❌");
    }

    // ordena la lista por fechas
    const itemsOrdenados = (response.data as ItemModel[]).sort((a, b) => {
      const [diaA, mesA, anioA] = a.fecha.split("/").map(Number);
      const [diaB, mesB, anioB] = b.fecha.split("/").map(Number);
      const dateA = new Date(anioA, mesA - 1, diaA);
      const dateB = new Date(anioB, mesB - 1, diaB);
      return dateA.getTime() - dateB.getTime();
    });

    return { success: true, data: itemsOrdenados };
  } catch (error) {
    return { success: false };
  }
};

const obtenerDatos = async (id: number): Promise<HistoriaCompletaResponse> => {
  try {
    const historia: HistoriaClinicaComunResult = await obtenerHistoria(id);
    const historiaData = historia.data as HistoriaClinicaComunModel;

    const parientes: ParienteResultRoles = await obtenerParientes(id);
    const parientesData = parientes.data as ParientesListasRolesModel;

    const items: ItemResult = await obtenerItems(id);
    const itemsData = items.data as ItemModel[];

    const dataCompleta: HistoriaCompleta = {
      fecha_creacion: historiaData.fecha_creacion!,
      nombre: historiaData.nombre,
      dni: historiaData.dni,
      edad: historiaData.edad,
      sexo: historiaData.sexo,
      estado_civil: historiaData.estado_civil,
      l_nacimiento: historiaData.l_nacimiento,
      l_residencia: historiaData.l_residencia,
      ocupacion: historiaData.ocupacion,
      motivo_consulta: historiaData.motivo_consulta,
      narracion: historiaData.narracion,
      antecedentes_enfermedad: historiaData.antecedentes_enfermedad,
      alergias: historiaData.alergias,
      antecedentes_fisiologicos: historiaData.antecedentes_fisiologicos,
      antecedentes_patologicos: historiaData.antecedentes_patologicos,
      antecedentes_quirurgicos: historiaData.antecedentes_quirurgicos,
      antecedentes_farmacologicos: historiaData.antecedentes_farmacologicos,
      madre_vive: historiaData.madre_vive,
      madre_causa_fallecimiento: historiaData.madre_causa_fallecimiento,
      madre_enfermedad: historiaData.madre_enfermedad,
      padre_vive: historiaData.padre_vive,
      padre_causa_fallecimiento: historiaData.padre_causa_fallecimiento,
      padre_enfermedad: historiaData.padre_enfermedad,
      h_alimentacion: historiaData.h_alimentacion,
      h_diuresis: historiaData.h_diuresis,
      h_catarsis: historiaData.h_catarsis,
      h_sueño: historiaData.h_sueño,
      h_alcohol_tabaco: historiaData.h_alcohol_tabaco,
      h_infusiones: historiaData.h_infusiones,
      h_farmacos: historiaData.h_farmacos,
      obra_social: historiaData.obra_social,
      material_casa: historiaData.material_casa,
      electricidad: historiaData.electricidad,
      agua: historiaData.agua,
      toilet_privado: historiaData.toilet_privado,
      calefaccion: historiaData.calefaccion,
      mascotas: historiaData.mascotas,
      otro: historiaData.otro,
      hijos: parientesData.hijos || [],
      hermanos: parientesData.hermanos || [],
      linea_tiempo: itemsData,
    };

    return { success: true, data: dataCompleta };
  } catch (error) {
    return { success: false };
  }
};