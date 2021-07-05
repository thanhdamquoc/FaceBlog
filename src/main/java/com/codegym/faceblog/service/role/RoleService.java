package com.codegym.faceblog.service.role;

import com.codegym.faceblog.model.Role;
import com.codegym.faceblog.service.GeneralService;

public interface RoleService extends GeneralService<Role> {
    Role findByName(String name);
}
