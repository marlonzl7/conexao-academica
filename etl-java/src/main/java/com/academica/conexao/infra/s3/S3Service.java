package com.academica.conexao.infra.s3;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

public class S3Service {

    private final S3Client s3Client;
    private final String bucket;

    public S3Service(S3Client s3Client, String bucket) {
        this.s3Client = s3Client;
        this.bucket = bucket;
    }

    public List<String> listarKeys() {
        return s3Client.listObjects(
                ListObjectsRequest.builder().bucket(bucket).build()
        ).contents().stream()
                .map(S3Object::key)
                .collect(Collectors.toList());
    }

    public List<String> filtrarKeys(List<String> keys, String fragmento) {
        return keys.stream()
                .filter(k -> k.contains(fragmento))
                .collect(Collectors.toList());
    }

    public InputStream abrirStream(String key) {
        return s3Client.getObject(
                GetObjectRequest.builder().bucket(bucket).key(key).build()
        );
    }

}
