package com.fse.project.projectManagement.repository;


import org.springframework.data.repository.CrudRepository;

import com.fse.project.projectManagement.dao.User;



public interface UserRepository extends CrudRepository<User, Integer> {

}