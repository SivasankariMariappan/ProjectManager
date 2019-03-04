package com.fse.project.projectManagement.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.fse.project.projectManagement.dao.Task;

public interface TaskRepository extends CrudRepository<Task,Integer>{

	List<Task> findAllByProjectId(Integer id);
		
	List<Task> findAllByProjectIdAndStatus(Integer id, String status);
	
}
