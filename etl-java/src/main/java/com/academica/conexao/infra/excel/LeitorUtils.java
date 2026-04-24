package com.academica.conexao.infra.excel;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

public class LeitorUtils {

    public String getString(Row row, int index) {
        Cell cell = row.getCell(index);

        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return normalize(cell.getStringCellValue());

            case NUMERIC:
                double value = cell.getNumericCellValue();

                if (value % 1 == 0) {
                    return String.valueOf((int) value);
                }

                return String.valueOf(value);

            default:
                return null;
        }
    }

    public Integer getInt(Row row, int index) {
        Cell cell = row.getCell(index);

        if (cell == null) return null;

        try {
            switch (cell.getCellType()) {
                case STRING:
                    String value = normalize(cell.getStringCellValue());

                    if (value == null) return null;

                    if (value.contains(".")) {
                        return (int) Double.parseDouble(value);
                    }

                    return Integer.parseInt(value);

                case NUMERIC:
                    return (int) cell.getNumericCellValue();

                default:
                    return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    private String normalize(String value) {
        if (value == null) return null;

        String trimmed = value.trim();

        if (trimmed.isEmpty()) return null;

        return trimmed;
    }

}
