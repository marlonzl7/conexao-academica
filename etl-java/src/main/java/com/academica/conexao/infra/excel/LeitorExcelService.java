package com.academica.conexao.infra.excel;

import com.github.pjfanning.xlsx.StreamingReader;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

public class LeitorExcelService {

    private Workbook workbook;
    private Sheet sheet;
    private Iterator<Row> iterator;

    private final Integer ROW_CACHE_SIZE;
    private final Integer BUFFER_SIZE = 4096;

    public LeitorExcelService(int rowCacheSize) {
        this.ROW_CACHE_SIZE = rowCacheSize;
    }

    public void abrir(InputStream is) throws RuntimeException {
        ZipSecureFile.setMaxEntrySize(Long.MAX_VALUE);
        this.workbook = StreamingReader.builder()
                .rowCacheSize(ROW_CACHE_SIZE)
                .bufferSize(BUFFER_SIZE)
                .open(is);

        this.sheet = workbook.getSheetAt(0);
        this.iterator = sheet.iterator();
    }

    public void fechar() throws IOException {
        workbook.close();
    }

    public Row lerLinha() {
        while (iterator.hasNext()) {
            return iterator.next();
        }

        return null;
    }
}