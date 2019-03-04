package com.fse.project.projectManagement.controller;


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

import com.fse.project.projectManagement.dao.User;
import com.fse.project.projectManagement.repository.UserRepository;



@CrossOrigin
@Controller   
@RequestMapping(path="/user")
public class UserController {
	
	@Autowired 
	private UserRepository userRepository;

	@PostMapping(path="/add")
	public @ResponseBody User addNewUser (@RequestBody User user) {

		User n = new User();
		n.setFirstName(user.getFirstName());
		n.setLastName(user.getLastName());
		n.setEmployeeId(user.getEmployeeId());
		return userRepository.save(n);
	}

	@GetMapping(path="/all")
	public @ResponseBody Iterable<User> getAllUsers() {
		return userRepository.findAll();
	}
	
	@PutMapping(path="/update")
	public @ResponseBody User updateUser(@RequestBody User user){
		
		Optional<User> userOptional = userRepository.findById(user.getUserId());
		if(userOptional.isPresent()) {
			User u = userOptional.get();
			u.setEmployeeId(user.getEmployeeId());
			u.setFirstName(user.getFirstName());
			u.setLastName(user.getLastName());
			return userRepository.save(u);	
		}
		return user;

	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public @ResponseBody String deleteUser(@PathVariable("id") Integer id){
	     userRepository.deleteById(id);
	     return "return";
		
	}
}

