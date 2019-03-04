package com.fse.project.projectManagement.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fse.project.projectManagement.dao.ParentTask;
import com.fse.project.projectManagement.dao.Project;
import com.fse.project.projectManagement.dao.Task;
import com.fse.project.projectManagement.dao.User;
import com.fse.project.projectManagement.model.TaskObj;
import com.fse.project.projectManagement.repository.ParentTaskRepository;
import com.fse.project.projectManagement.repository.ProjectRepository;
import com.fse.project.projectManagement.repository.TaskRepository;
import com.fse.project.projectManagement.repository.UserRepository;

@CrossOrigin
@Controller
@RequestMapping(path="/task")
public class TaskController {
	
	@Autowired 
	TaskRepository taskRepo;
	
	@Autowired
	private ParentTaskRepository repo;
	
	@Autowired
	private ProjectRepository projectRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@PostMapping(path="/add")
	public @ResponseBody String addNewTask (@RequestBody TaskObj task) {
		//System.out.println(task.isParentTask());
		if(task.isParentTask()){
			ParentTask pTask = new ParentTask();
			pTask.setParentTask(task.getTaskName());
			repo.save(pTask);
		}else{
			Task t = new Task();
			t.setParentId(task.getParentTaskId());
			t.setProjectId(task.getProjectId());
			t.setTask(task.getTaskName());
			t.setStartDate(task.getStartDate());
			t.setEndDate(task.getEndDate());
			t.setPriority(task.getPriority());
			t.setUserId(task.getUserId());	
			t.setStatus("STARTED");
			taskRepo.save(t);
		}
		
		return "Saved";
	}

	@GetMapping(path="/all")
	public @ResponseBody List<TaskObj> getAllTasks() {
		List<TaskObj> taskObjList = new ArrayList<>();
		List<Task> taskList =  (List<Task>) taskRepo.findAll();
		for(Task t: taskList){
			TaskObj obj = new TaskObj();
			obj.setTaskId(t.getTaskId());
			obj.setParentTaskId(t.getParentId());
			obj.setProjectId(t.getProjectId());
			obj.setTaskName(t.getTask());
			obj.setStartDate(t.getStartDate());
			obj.setEndDate(t.getEndDate());
			obj.setPriority(t.getPriority());
			obj.setStatus(t.getStatus());
			obj.setUserId(t.getUserId());
			if(t.getParentId() != null){
				Optional<ParentTask> pTaskOptional = repo.findById(t.getParentId());
				if(pTaskOptional.isPresent()){
					obj.setParentTaskName(pTaskOptional.get().getParentTask());
				}
			}
			if(t.getProjectId() != null){
				Optional<Project> projectOptional = projectRepo.findById(t.getProjectId());
				if(projectOptional.isPresent()){
					obj.setProjectName(projectOptional.get().getProject());
				}	
			}
			if(t.getUserId() != null){
				Optional<User> userOptional = userRepo.findById(t.getUserId());
				if(userOptional.isPresent()){
					obj.setUserName(userOptional.get().getFirstName());
				}
			}
			
			taskObjList.add(obj);
			
		}
		return taskObjList;
	}
	
	@PutMapping(path="/update")
	public @ResponseBody Task updateTask(@RequestBody TaskObj task){
		
		Optional<Task> taskOptional = taskRepo.findById(task.getTaskId());
		if(taskOptional.isPresent()) {
			Task t = taskOptional.get();
			t.setParentId(task.getParentTaskId());
			t.setProjectId(task.getProjectId());
			t.setTask(task.getTaskName());
			t.setStartDate(task.getStartDate());
			t.setEndDate(task.getEndDate());
			t.setPriority(task.getPriority());
	        t.setStatus(task.getStatus());     
			return taskRepo.save(t);	
		}
		return null;

	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public @ResponseBody String deleteTask(@PathVariable("id") Integer id){
         taskRepo.deleteById(id);
	     return "return";
		
	}
	
	@RequestMapping(value = "/project/{id}", method = RequestMethod.GET)
	public @ResponseBody Iterable<TaskObj> getTasksByProject(@PathVariable("id") Integer id){
 
		List<TaskObj> taskObjList = new ArrayList<>();
		List<Task> taskList = taskRepo.findAllByProjectId(id);
		for(Task t: taskList){
			TaskObj obj = new TaskObj();
			obj.setTaskId(t.getTaskId());
			obj.setParentTaskId(t.getParentId());
			obj.setProjectId(t.getProjectId());
			obj.setTaskName(t.getTask());
			obj.setStartDate(t.getStartDate());
			obj.setEndDate(t.getEndDate());
			obj.setPriority(t.getPriority());
			obj.setStatus(t.getStatus());
			obj.setUserId(t.getUserId());
			if(t.getParentId() != null){
				Optional<ParentTask> pTaskOptional = repo.findById(t.getParentId());
				if(pTaskOptional.isPresent()){
					obj.setParentTaskName(pTaskOptional.get().getParentTask());
				}
			}
			if(t.getProjectId() != null){
				Optional<Project> pOptional = projectRepo.findById(t.getProjectId());
				if(pOptional.isPresent()){
					obj.setProjectName(pOptional.get().getProject());
				}	
			}
			if(t.getUserId() != null){
				Optional<User> userOptional = userRepo.findById(t.getUserId());
				if(userOptional.isPresent()){
					obj.setUserName(userOptional.get().getFirstName());
				}
			}
			
			taskObjList.add(obj);
			
		}
		return taskObjList;
		
	}

}
