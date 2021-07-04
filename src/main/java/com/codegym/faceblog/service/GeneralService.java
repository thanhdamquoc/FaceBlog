package com.codegym.faceblog.service;

public interface GeneralService<T> {
    Iterable<T> findAll();
    T findById(Long id);
    T save(T t);
    void deleteById(Long id);
}
