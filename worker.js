import {
  BlobWriter,
  HttpReader,
  TextReader,
  ZipWriter,
} from "https://unpkg.com/@zip.js/zip.js/index.js";


onmessage = async (e) => {
  const incorrectA = e.data.incorrectAnswers;
  const correctA = e.data.correctAnswers || 0
  const text = `${correctA} / ${Number(incorrectA) + Number(correctA)}`
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await zipWriter.add("QuizScore.txt", new TextReader(text))
  const blob = await zipWriter.close()
  postMessage(blob)
}