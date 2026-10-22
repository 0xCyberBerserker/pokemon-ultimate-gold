#!/usr/bin/env python3
"""Small Qt launcher for the local Ultimate Gold xdelta patcher."""

from __future__ import annotations

from pathlib import Path
import sys

from PySide6.QtCore import QProcess
from PySide6.QtGui import QIcon
from PySide6.QtWidgets import (QApplication, QFileDialog, QFormLayout, QHBoxLayout,
                               QLabel, QLineEdit, QMainWindow, QPushButton, QComboBox,
                               QPlainTextEdit, QVBoxLayout, QWidget)

ROOT = Path(__file__).resolve().parents[1]
PATCHER = ROOT / "tools" / "patcher.py"

TEXT = {
    "en": {"title": "Ultimate Gold Patcher", "source": "Clean ROM (.nds/.zip)",
           "output": "Output ROM (.nds)", "xdelta": "xdelta3 (optional)", "browse": "Browse",
           "apply": "Apply patch", "running": "Running…", "ready": "Ready.",
           "source_missing": "Select a clean ROM first.", "output_missing": "Select an output path.",
           "done": "Patch completed.", "failed": "Patch failed."},
    "es": {"title": "Patcher de Ultimate Gold", "source": "ROM limpia (.nds/.zip)",
           "output": "ROM de salida (.nds)", "xdelta": "xdelta3 (opcional)", "browse": "Examinar",
           "apply": "Aplicar patch", "running": "Ejecutando…", "ready": "Listo.",
           "source_missing": "Selecciona primero una ROM limpia.", "output_missing": "Selecciona una salida.",
           "done": "Patch completado.", "failed": "El patch ha fallado."},
    "ca": {"title": "Patcher d'Ultimate Gold", "source": "ROM neta (.nds/.zip)",
           "output": "ROM de sortida (.nds)", "xdelta": "xdelta3 (opcional)", "browse": "Examinar",
           "apply": "Aplicar patch", "running": "Executant…", "ready": "Preparat.",
           "source_missing": "Selecciona primer una ROM neta.", "output_missing": "Selecciona una sortida.",
           "done": "Patch completat.", "failed": "El patch ha fallat."},
}


class Window(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowIcon(QIcon(str(ROOT / "assets" / "icon.svg")))
        self.language = QComboBox()
        self.language.addItem("English", "en")
        self.language.addItem("Español", "es")
        self.language.addItem("Català", "ca")
        self.language.currentIndexChanged.connect(self.translate)
        self.source = QLineEdit()
        self.output = QLineEdit()
        self.xdelta = QLineEdit()
        self.log = QPlainTextEdit()
        self.log.setReadOnly(True)
        self.source_label, self.output_label, self.xdelta_label = QLabel(), QLabel(), QLabel()
        self.browse_source, self.browse_output, self.browse_xdelta = QPushButton(), QPushButton(), QPushButton()
        self.apply = QPushButton()
        form = QFormLayout()
        for label, edit, browse in ((self.source_label, self.source, self.browse_source),
                                    (self.output_label, self.output, self.browse_output),
                                    (self.xdelta_label, self.xdelta, self.browse_xdelta)):
            row = QHBoxLayout(); row.addWidget(edit); row.addWidget(browse); form.addRow(label, row)
        self.browse_source.clicked.connect(self.pick_source)
        self.browse_output.clicked.connect(self.pick_output)
        self.browse_xdelta.clicked.connect(self.pick_xdelta)
        self.apply.clicked.connect(self.run_patcher)
        top = QHBoxLayout(); top.addWidget(self.language); top.addStretch()
        layout = QVBoxLayout(); layout.addLayout(top); layout.addLayout(form); layout.addWidget(self.apply); layout.addWidget(self.log)
        central = QWidget(); central.setLayout(layout); self.setCentralWidget(central)
        self.process: QProcess | None = None
        self.translate()

    def t(self, key: str) -> str:
        return TEXT[self.language.currentData()][key]

    def translate(self) -> None:
        self.setWindowTitle(self.t("title")); self.source_label.setText(self.t("source"))
        self.output_label.setText(self.t("output")); self.xdelta_label.setText(self.t("xdelta"))
        for button in (self.browse_source, self.browse_output, self.browse_xdelta): button.setText(self.t("browse"))
        self.apply.setText(self.t("apply"))

    def pick_source(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, self.t("source"), "", "ROM (*.nds *.zip)")
        if path: self.source.setText(path)

    def pick_output(self) -> None:
        path, _ = QFileDialog.getSaveFileName(self, self.t("output"), "", "ROM (*.nds)")
        if path: self.output.setText(path)

    def pick_xdelta(self) -> None:
        path, _ = QFileDialog.getOpenFileName(self, self.t("xdelta"))
        if path: self.xdelta.setText(path)

    def run_patcher(self) -> None:
        if not self.source.text(): self.log.appendPlainText(self.t("source_missing")); return
        if not self.output.text(): self.log.appendPlainText(self.t("output_missing")); return
        self.apply.setEnabled(False); self.log.clear(); self.log.appendPlainText(self.t("running"))
        self.process = QProcess(self)
        self.process.setProgram(sys.executable)
        args = [str(PATCHER), self.source.text(), self.output.text()]
        if self.xdelta.text(): args += ["--xdelta", self.xdelta.text()]
        self.process.setArguments(args); self.process.setProcessChannelMode(QProcess.MergedChannels)
        self.process.readyReadStandardOutput.connect(lambda: self.log.appendPlainText(bytes(self.process.readAllStandardOutput()).decode(errors="replace").rstrip()))
        self.process.finished.connect(self.finished)
        self.process.errorOccurred.connect(self.process_error)
        self.process.start()

    def process_error(self, _error: QProcess.ProcessError) -> None:
        self.apply.setEnabled(True)
        self.log.appendPlainText(self.process.errorString() if self.process else self.t("failed"))

    def finished(self, code: int, _status: QProcess.ExitStatus) -> None:
        self.apply.setEnabled(True)
        self.log.appendPlainText(self.t("done") if code == 0 else self.t("failed"))


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--xdelta", default="")
    args, qt_args = parser.parse_known_args()
    app = QApplication([sys.argv[0], *qt_args])
    app.setDesktopFileName("sacred-gold-qol-patcher.desktop")
    window = Window(); window.resize(720, 420); window.xdelta.setText(args.xdelta); window.show()
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
