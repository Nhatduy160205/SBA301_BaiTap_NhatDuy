/**
 * Author: Trần Nhật Duy - CE190982
 * Subject: SBA301 - Assignment 02
 * Exception: BusinessException
 */
package com.badmintion.backend.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
